/// <reference types="node" />
/**
 * Fetch Home Assistant mock fixtures for Storybook.
 *
 * Pulls the JSON registries (entity/area/device/person) over SSH and downloads
 * the images they reference so Storybook renders real photos:
 *   - serve pictures   (`/api/image/serve/<id>/<size>`) via `scp`
 *   - proxy images     (`/api/image_proxy/<entity_id>`) via the HA HTTP API
 *   - integration brand icons (`/api/brands/integration/<domain>/icon@2x.png`)
 *
 * Images are saved under `.storybook/mocks/` mirroring the exact URL the app requests, so
 * the Storybook static dir (`staticDirs: ['./mocks']`) serves them at the same
 * path already stored in the data — no rewriting needed.
 *
 * Env:
 *   HA_TOKEN  long-lived access token (required only for proxy images)
 *   HA_URL    HA base URL for the HTTP API (default http://192.168.1.11:8123 —
 *             the IP the `homeassistant` SSH alias resolves to; the alias itself
 *             is SSH-only and does not resolve over HTTP)
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

// Load a git-ignored `.env` (if present) so HA_TOKEN/HA_URL don't have to be
// exported into the shell. Falls back to the ambient environment otherwise.
try {
  process.loadEnvFile();
} catch {
  // no .env file — rely on the ambient environment
}

const SSH_HOST = 'homeassistant';
// Strip any trailing slash so `${HA_URL}${path}` never produces a `//` (which
// makes HA return 404). `.env` values like `http://host:8123/` are common.
const HA_URL = (process.env.HA_URL ?? 'http://192.168.1.11:8123').replace(/\/+$/, '');
const HA_TOKEN = process.env.HA_TOKEN;

const MOCKS_DIR = join('.storybook', 'mocks');

const IMAGE_SERVE_RE = /^\/api\/image\/serve\/[0-9a-f]+\/\d+x\d+$/;

type Counters = { fetched: number; skipped: number; failed: number };

function ensureDir(filePath: string): void {
  mkdirSync(dirname(filePath), { recursive: true });
}

/** `ssh homeassistant cat <remotePath>` → returns file contents. */
function sshCat(remotePath: string): string {
  return execFileSync('ssh', [SSH_HOST, 'cat', remotePath], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
}

/** `scp homeassistant:<remotePath> <localPath>`. */
function scp(remotePath: string, localPath: string): void {
  ensureDir(localPath);
  execFileSync('scp', [`${SSH_HOST}:${remotePath}`, localPath], { stdio: 'ignore' });
}

/** Fetch a `.storage` registry and write it to .storybook/mocks/. */
function fetchRegistry(storageKey: string, outName: string): unknown {
  const json = sshCat(`config/.storage/${storageKey}`);
  const mocksPath = join(MOCKS_DIR, `${outName}.json`);
  ensureDir(mocksPath);
  writeFileSync(mocksPath, json);
  console.log(`  ✓ ${outName}.json`);
  try {
    return JSON.parse(json);
  } catch {
    console.warn(`  ! ${outName}.json is not valid JSON`);
    return undefined;
  }
}

/** Save an `/api/image/serve/<id>/<size>` picture via scp, mirroring the path. */
function fetchServeImage(picture: string, label: string, counters: Counters): void {
  if (!IMAGE_SERVE_RE.test(picture)) {
    console.warn(`  ! ${label}: unsupported picture format "${picture}" (skipped)`);
    counters.skipped++;
    return;
  }
  // /api/image/serve/<id>/<size>  ->  config/image/<id>/<size>
  const rel = picture.replace('/api/image/serve/', '');
  const remote = `config/image/${rel}`;
  const local = join(MOCKS_DIR, 'api', 'image', 'serve', rel);
  try {
    scp(remote, local);
    console.log(`  ✓ ${label}: ${picture}`);
    counters.fetched++;
  } catch (err) {
    console.warn(`  ✗ ${label}: failed to scp ${remote} (${(err as Error).message})`);
    counters.failed++;
  }
}

function get<T = unknown>(obj: unknown, key: string): T | undefined {
  if (obj && typeof obj === 'object' && key in obj) {
    return (obj as Record<string, T>)[key];
  }
  return undefined;
}

async function haFetch(path: string): Promise<Response> {
  const headers: Record<string, string> = {};
  if (HA_TOKEN) headers.Authorization = `Bearer ${HA_TOKEN}`;
  return fetch(`${HA_URL}${path}`, { headers });
}

/** Download an integration brand icon, mirroring the `/api/brands/...` path. */
async function fetchBrandIcon(domain: string, counters: Counters): Promise<void> {
  const path = `/api/brands/integration/${domain}/icon@2x.png`;
  const local = join(MOCKS_DIR, 'api', 'brands', 'integration', domain, 'icon@2x.png');
  try {
    const res = await haFetch(path);
    if (!res.ok) {
      console.warn(`  \u2717 ${domain}: brand icon returned ${res.status}`);
      counters.failed++;
      return;
    }
    const bytes = Buffer.from(await res.arrayBuffer());
    ensureDir(local);
    writeFileSync(local, bytes);
    console.log(`  \u2713 ${domain} icon`);
    counters.fetched++;
  } catch (err) {
    console.warn(`  \u2717 ${domain}: ${(err as Error).message}`);
    counters.failed++;
  }
}

async function main(): Promise<void> {
  console.log('Fetching registries...');
  const entityReg = fetchRegistry('core.entity_registry', 'entity_registry');
  const areaReg = fetchRegistry('core.area_registry', 'area_registry');
  fetchRegistry('core.device_registry', 'device_registry');
  const personReg = fetchRegistry('person', 'person');

  const serveCounters: Counters = { fetched: 0, skipped: 0, failed: 0 };
  console.log('\nFetching serve images...');
  const areas = get<unknown[]>(get(areaReg, 'data'), 'areas') ?? [];
  const personData = get(personReg, 'data');
  const persons =
    get<unknown[]>(personData, 'items') ?? get<unknown[]>(personData, 'persons') ?? [];
  const servePictures = Array.from(
    new Set(
      [...areas, ...persons]
        .map((item) => get<string>(item, 'picture'))
        .filter((p): p is string => !!p)
    )
  );
  for (const picture of servePictures) {
    fetchServeImage(picture, picture, serveCounters);
  }

  const proxyCounters: Counters = { fetched: 0, skipped: 0, failed: 0 };
  console.log('\nFetching proxy images...');
  const entities = get<unknown[]>(get(entityReg, 'data'), 'entities') ?? [];
  const proxyImages = entities.filter((e) => {
    const id = get<string>(e, 'entity_id') ?? '';
    return id.startsWith('image.');
  });
  if (!HA_TOKEN) {
    console.warn(
      `  ! HA_TOKEN not set — skipping ${proxyImages.length} proxy image(s). ` +
        'Set HA_TOKEN (HA Profile → Security → Long-lived access tokens) to fetch them.'
    );
    proxyCounters.skipped += proxyImages.length;
  } else {
    for (const entity of proxyImages) {
      const id = get<string>(entity, 'entity_id')!;
      try {
        const stateRes = await haFetch(`/api/states/${id}`);
        if (!stateRes.ok) {
          console.warn(`  ✗ ${id}: /api/states returned ${stateRes.status}`);
          proxyCounters.failed++;
          continue;
        }
        const state = (await stateRes.json()) as { attributes?: { entity_picture?: string } };
        const entityPicture = state.attributes?.entity_picture;
        if (!entityPicture) {
          console.warn(`  ! ${id}: no entity_picture attribute (skipped)`);
          proxyCounters.skipped++;
          continue;
        }
        const imgRes = await haFetch(entityPicture);
        if (!imgRes.ok) {
          console.warn(`  ✗ ${id}: image fetch returned ${imgRes.status}`);
          proxyCounters.failed++;
          continue;
        }
        const bytes = Buffer.from(await imgRes.arrayBuffer());
        const local = join(MOCKS_DIR, 'api', 'image_proxy', id);
        ensureDir(local);
        writeFileSync(local, bytes);
        console.log(`  ✓ ${id}`);
        proxyCounters.fetched++;
      } catch (err) {
        console.warn(`  ✗ ${id}: ${(err as Error).message}`);
        proxyCounters.failed++;
      }
    }
  }

  const brandCounters: Counters = { fetched: 0, skipped: 0, failed: 0 };
  console.log('\nFetching integration brand icons...');
  const platforms = Array.from(
    new Set(entities.map((e) => get<string>(e, 'platform')).filter((p): p is string => !!p))
  );
  for (const domain of platforms) {
    await fetchBrandIcon(domain, brandCounters);
  }

  const total = (c: Counters) => c.fetched + c.skipped + c.failed;
  console.log('\nSummary:');
  console.log(
    `  serve:  ${serveCounters.fetched} fetched, ${serveCounters.skipped} skipped, ${serveCounters.failed} failed (of ${total(serveCounters)})`
  );
  console.log(
    `  proxy:  ${proxyCounters.fetched} fetched, ${proxyCounters.skipped} skipped, ${proxyCounters.failed} failed (of ${total(proxyCounters)})`
  );
  console.log(
    `  brands: ${brandCounters.fetched} fetched, ${brandCounters.skipped} skipped, ${brandCounters.failed} failed (of ${total(brandCounters)})`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
