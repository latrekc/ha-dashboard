/// <reference types="node" />
/**
 * Print the live-rendered dashboard tree to stdout.
 *
 * Usage (use --silent so npm's own banner lines don't pollute stdout):
 *   npm run --silent dump:tree                 # full YAML tree on stdout
 *   npm run --silent dump:tree -- --compact    # one `view / type / anchor` line per card
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

// --- jsdom globals (mirror jest's jsdom testEnvironment) --------------------
// jest-environment-jsdom copies every window prop onto the Node global; do the
// same so Lit (which touches Document/CSSStyleSheet at import time) loads.
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });
const g = globalThis as Record<string, unknown>;
for (const key of Object.getOwnPropertyNames(dom.window)) {
  if (!(key in g)) {
    try {
      g[key] = (dom.window as Record<string, unknown>)[key];
    } catch {
      // getter-only or otherwise uncopyable — ignore
    }
  }
}
// Lit schedules renders on rAF; jsdom has none — fall back to a timer.
if (!g.requestAnimationFrame) {
  g.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(() => cb(Date.now()), 0);
  g.cancelAnimationFrame = (id: NodeJS.Timeout) => clearTimeout(id as unknown as number);
}

// --- public mock folder, read as plain JSON (not via .storybook/*.ts) -------
// `.storage`-shaped dumps: the list lives under `data.entities / devices /
// areas / items`. The area fixture keys areas by `id`; the websocket
// `config/area_registry/list` shape uses `area_id` — normalized here, the
// same normalization the hidden mock hass applies.
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MOCKS = join(ROOT, '.storybook', 'mocks');

function loadList<T>(file: string, keys: string[]): T[] {
  const raw = JSON.parse(readFileSync(join(MOCKS, file), 'utf8')) as unknown;
  if (Array.isArray(raw)) return raw as T[];
  const data = (raw as { data?: Record<string, unknown> } | undefined)?.data;
  for (const key of keys) {
    const list = data?.[key];
    if (Array.isArray(list)) return list as T[];
  }
  return [];
}

const ENTITIES = loadList<Record<string, unknown>>('entity_registry.json', ['entities']);
const DEVICES = loadList<Record<string, unknown>>('device_registry.json', ['devices']);
const PERSONS = loadList<{ id: string; name: string }>('person.json', ['items']);
const AREAS = loadList<Record<string, unknown> & { id?: string; area_id?: string }>(
  'area_registry.json',
  ['areas']
).map((a) => ({
  area_id: a.area_id ?? a.id ?? '',
  name: a.name,
  icon: a.icon ?? null,
  picture: a.picture ?? null,
}));

function makeHass(): Record<string, unknown> {
  const states: Record<string, unknown> = {};
  for (const e of ENTITIES) {
    const id = e.entity_id as string;
    if (typeof id !== 'string') continue;
    states[id] = {
      entity_id: id,
      state: '21',
      attributes: { friendly_name: id },
      last_updated: new Date().toISOString(),
    };
  }
  return {
    states,
    entities: Object.fromEntries(
      ENTITIES.map((e) => [e.entity_id as string, e]).filter(([id]) => typeof id === 'string')
    ),
    devices: Object.fromEntries(DEVICES.map((d) => [d.id as string, d])),
    areas: Object.fromEntries(AREAS.map((a) => [a.area_id, a])),
    callWS: async (msg: Record<string, unknown>) => {
      if (msg.type === 'config/entity_registry/list') return ENTITIES;
      if (msg.type === 'config/device_registry/list') return DEVICES;
      if (msg.type === 'config/area_registry/list') return AREAS;
      if (msg.type === 'person/list') return PERSONS;
      return [];
    },
    callApi: async () => [],
    callService: async () => undefined,
  };
}

// --- minimal YAML emitter (same shape as the eval tree documents) ------------
function scalar(v: unknown): string {
  if (v === null || v === undefined) return 'null';
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  return JSON.stringify(String(v));
}

function yaml(value: unknown, indent = 0): string {
  const pad = '  '.repeat(indent);
  if (Array.isArray(value)) {
    if (value.length === 0) return `${pad}[]`;
    return value
      .map((item) => {
        if (item && typeof item === 'object') {
          const body = yaml(item, indent + 1).split('\n');
          body[0] = `${pad}- ${body[0].slice((indent + 1) * 2)}`;
          return body.join('\n');
        }
        return `${pad}- ${scalar(item)}`;
      })
      .join('\n');
  }
  if (value && typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 0) return `${pad}{}`;
    return keys
      .map((k) => {
        const v = (value as Record<string, unknown>)[k];
        if (v === null || typeof v !== 'object') return `${pad}${k}: ${scalar(v)}`;
        if (Array.isArray(v) && v.length === 0) return `${pad}${k}: []`;
        return `${pad}${k}:\n${yaml(v, indent + 1)}`;
      })
      .join('\n');
  }
  return `${pad}${scalar(value)}`;
}

const HEADER =
  '# Expected dashboard tree — GROUND TRUTH generated from the mock folder\n' +
  '# (.storybook/mocks/*.json) by rendering the real strategy + cards. Do not hand-edit.\n';

// --- card render + serialization (inline twin of the hidden builder) --------
// Renders every strategy anchor through its REAL card and serializes
// metrics/controls/devices to the same shape as the committed tree.
// The mdi reverse-map renders device icons as `mdiXxx` names instead of
// raw SVG path data (`@mdi/js` is an npm dependency, not a hidden folder).
async function describeTree(): Promise<{ views: unknown[] }> {
  const mdiAll = (await import('@mdi/js')) as unknown as Record<string, string>;
  // Strategy first: without it there is no tree at all.
  const { LatrekcDashboardStrategy } = await import('../src/strategy/latrekc-dashboard-strategy');
  // Cards individually: a stripped/missing card file must degrade that card
  // to an empty placeholder, not fail the run — so each import is guarded.
  // (The barrel `src/index` can't be used: one missing file breaks it whole.)
  for (const card of [
    'latrekc-battery-card',
    'latrekc-plant-card',
    'latrekc-room-card',
    'latrekc-miele-card',
    'latrekc-vacuum-card',
    'latrekc-person-card',
    'latrekc-climate-card',
  ]) {
    try {
      await import(`../src/cards/${card}`);
    } catch {
      // element stays unregistered → describeCard emits a placeholder
    }
  }

  const MDI_NAME: Record<string, string> = Object.fromEntries(
    Object.entries(mdiAll).map(([name, path]) => [path, name])
  );
  const doc = (globalThis as Record<string, unknown>).document as Document | undefined;
  // Null-safe by design: if the DOM is unavailable or a card never renders
  // (e.g. its implementation was stripped), the card degrades to an empty
  // placeholder instead of throwing — the script always exits 0 with a tree.
  const settle = async (el: { updateComplete?: Promise<unknown> }) => {
    try {
      await el.updateComplete;
      await new Promise((r) => setTimeout(r, 0));
      await el.updateComplete;
    } catch {
      // render never settled — treat as unrendered below
    }
  };
  const ents = (el: Element | null): string[] =>
    (el?.getAttribute('data-entities') ?? '').split(/\s+/).filter(Boolean);
  const controlKind = (dataId: string): string =>
    dataId.startsWith('control-light-') ? 'light' : dataId.replace(/^control-/, '');
  const singleMetrics = (shadow: ParentNode | null) =>
    shadow === null
      ? []
      : Array.from(shadow.querySelectorAll('button.metric[data-id^="metric-"]')).map((b) => ({
          kind: b.getAttribute('data-id')!.replace('metric-', ''),
          entity: ents(b)[0] ?? null,
        }));
  const singleControls = (shadow: ParentNode | null) =>
    shadow === null
      ? []
      : Array.from(shadow.querySelectorAll('button.ctrl[data-id^="control-"]')).map((b) => ({
          kind: controlKind(b.getAttribute('data-id')!),
          entity: ents(b)[0] ?? null,
        }));
  const dropdownMembers = async (shadow: ParentNode | null, prefix: 'metric' | 'control') => {
    const out: Array<{ kind: string; entity: string | null }> = [];
    if (shadow === null) return out;
    const wraps = Array.from(shadow.querySelectorAll(`[data-id^="${prefix}-dropdown-"]`));
    for (const wrap of wraps) {
      const trigger = wrap.querySelector('.dropdown-trigger') as HTMLButtonElement | null;
      if (!trigger) continue;
      trigger.click();
      await new Promise((r) => setTimeout(r, 0));
      for (const row of Array.from(
        wrap.querySelectorAll('[data-id="dropdown-panel"] .dropdown-item')
      )) {
        const dataId = row.getAttribute('data-id') as string;
        out.push({
          kind: prefix === 'control' ? controlKind(dataId) : dataId.replace(/^metric-/, ''),
          entity: ents(row)[0] ?? null,
        });
      }
      trigger.click();
      await new Promise((r) => setTimeout(r, 0));
    }
    return out;
  };

  const describeCard = async (cfg: Record<string, unknown>, hass: unknown) => {
    const type = (cfg.type as string).replace('custom:latrekc-', '').replace('-card', '');
    const anchor = cfg.device_id
      ? { device_id: cfg.device_id }
      : cfg.area_id
        ? { area_id: cfg.area_id }
        : { person_id: cfg.person_id };
    // Unrenderable card (no DOM, unknown element, missing shadow root):
    // emit the anchor with empty placeholders instead of throwing.
    if (doc === undefined) return { type, ...anchor, metrics: [], controls: [] };
    let el:
      | (Record<string, unknown> & {
          updateComplete?: Promise<unknown>;
          remove: () => void;
          shadowRoot: ShadowRoot | null;
        })
      | null = null;
    try {
      el = doc.createElement((cfg.type as string).replace('custom:', '')) as unknown as Record<
        string,
        unknown
      > & {
        updateComplete?: Promise<unknown>;
        remove: () => void;
        shadowRoot: ShadowRoot | null;
      };
      (el as Record<string, unknown>).config = cfg;
      (el as Record<string, unknown>).hass = hass;
      doc.body.appendChild(el as unknown as Element);
      await settle(el);
    } catch {
      try {
        el?.remove();
      } catch {
        // ignore cleanup failures
      }
      return { type, ...anchor, metrics: [], controls: [] };
    }
    const shadow = el.shadowRoot;
    if (shadow === null) {
      try {
        el.remove();
      } catch {
        // ignore cleanup failures
      }
      return { type, ...anchor, metrics: [], controls: [] };
    }
    let metrics = [...singleMetrics(shadow), ...(await dropdownMembers(shadow, 'metric'))];
    if (type === 'battery') {
      const entity = ents(shadow.querySelector('[data-id="value"]'))[0] ?? null;
      metrics = [{ kind: 'battery', entity }];
    }
    const controls = [...singleControls(shadow), ...(await dropdownMembers(shadow, 'control'))];
    const card: Record<string, unknown> = { type, ...anchor };
    if (metrics.length) card.metrics = metrics;
    if (controls.length) card.controls = controls;
    const toggle = shadow.querySelector('[data-id="toggle-devices"]') as HTMLButtonElement | null;
    if (toggle) {
      toggle.click();
      await settle(el);
      const shadowAfterToggle = el.shadowRoot;
      const devices =
        shadowAfterToggle === null
          ? []
          : Array.from(
              shadowAfterToggle.querySelectorAll('[data-id="devices"] .device[data-id^="device-"]')
            ).map((row) => ({
              entity: ents(row)[0] ?? null,
              icon: (() => {
                const path = row.querySelector('[data-icon]')?.getAttribute('data-icon');
                return path ? (MDI_NAME[path] ?? path) : null;
              })(),
            }));
      if (devices.length) card.devices = devices;
    }
    try {
      el.remove();
    } catch {
      // ignore cleanup failures
    }
    return card;
  };

  const dash = await LatrekcDashboardStrategy.generate(
    { type: 'custom:latrekc-dashboard' },
    makeHass() as never
  );
  const views: unknown[] = [];
  if (doc === undefined) {
    // No DOM at all: strategy anchors only, no card detail.
    for (const view of dash.views as Array<{ title: string; cards: Record<string, unknown>[] }>) {
      views.push({
        view: view.title,
        cards: view.cards.map((cfg) => ({
          type: (cfg.type as string).replace('custom:latrekc-', '').replace('-card', ''),
          ...(cfg.device_id
            ? { device_id: cfg.device_id }
            : cfg.area_id
              ? { area_id: cfg.area_id }
              : { person_id: cfg.person_id }),
          metrics: [],
          controls: [],
        })),
      });
    }
    return { views };
  }
  for (const view of dash.views as Array<{ title: string; cards: Record<string, unknown>[] }>) {
    doc.body.innerHTML = '';
    const cards: unknown[] = [];
    for (const cfg of view.cards) {
      doc.body.innerHTML = '';
      cards.push(await describeCard(cfg, makeHass()));
    }
    views.push({ view: view.title, cards });
  }
  return { views };
}

async function main(): Promise<void> {
  const tree = await describeTree();
  if (process.argv.includes('--compact')) {
    for (const view of tree.views as Array<{
      view: string;
      cards: Array<{ type: string; device_id?: string; area_id?: string; person_id?: string }>;
    }>) {
      for (const card of view.cards) {
        const anchor = card.device_id ?? card.area_id ?? card.person_id ?? '?';
        console.log(`${view.view} / ${card.type} / ${anchor}`);
      }
    }
    console.error(`\n${tree.views.length} views rendered (compact listing)`);
  } else {
    process.stdout.write(`${HEADER}\n${yaml(tree)}\n`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
