# latrekc-dashboard

A Home Assistant custom dashboard built as **per-entity custom cards** driven by a
Lovelace **dashboard strategy**. A single ES module bundle
`dist/latrekc-dashboard.js` registers seven custom cards and one strategy.

This README is a **contract**: it describes what the dashboard produces and the
observable markers that tests (and any other consumer) may rely on. It does not
describe how any of it is implemented internally — only the behaviour you can see
from the outside. Every behaviour below is guaranteed; nothing else about the DOM
structure is contractual.

## Implementation requirements

- The **dashboard strategy** follows Home Assistant's
  [custom strategy contract](https://developers.home-assistant.io/docs/frontend/custom-ui/custom-strategy/)
  — `custom:latrekc-dashboard` → `ll-strategy-dashboard-latrekc-dashboard` per
  [`get-strategy.ts#L97-L116`](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/strategies/get-strategy.ts#L97-L116) —
  and extends `ReactiveElement`.
- Every **card** follows Home Assistant's
  [custom card contract](https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card)
  and extends `LitElement`.

## Home Assistant integration

### Lovelace resource

Add a resource:

- URL: `/local/latrekc/latrekc-dashboard.js`
- Type: `module`

### Dashboard creation

Dashboards → Add → Strategy type `custom:latrekc-dashboard` (element `ll-strategy-dashboard-latrekc-dashboard`, `window.customStrategies` type `latrekc-dashboard`, see [`get-strategy.ts#L97-L116`](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/strategies/get-strategy.ts#L97-L116)):

```yaml
strategy:
  type: custom:latrekc-dashboard
```

### Deployment

Target: `homeassistant:config/www/latrekc/` via scp.

```bash
npm run deploy
# runs: lint && format:check && typecheck && build && scp dist/latrekc-dashboard.js homeassistant:config/www/latrekc/latrekc-dashboard.js
```

Manual:

```bash
scp dist/latrekc-dashboard.js homeassistant:config/www/latrekc/latrekc-dashboard.js
```

## Local development

```bash
npm ci
npm run storybook        # dev -p 6006, mock testing without a live HA connection
npm run lint             # eslint src --ext .ts
npm run lint:fix
npm run format           # prettier --write .
npm run format:check
npm run typecheck        # tsc --noEmit
npm run build            # vite build → dist/latrekc-dashboard.js (single file)
npm run build-storybook
npm test                 # jest
npm run test:coverage    # jest with coverage
npm run validate         # typecheck + lint + format:check + test
```

### Fetching mock fixtures (only on the home network)

`npm run fetch:mock` downloads everything Storybook needs:

- **Registries** — entity, area and device registries plus people, pulled over SSH
  (the `homeassistant` alias) into `.storybook/mocks/`.
- **Area & person images** — `/api/image/serve/<id>/<size>` pictures, copied so
  Storybook's static dir serves them at the same request path.
- **Plant (Fyta) images** — `image.*` photos, downloaded over the HA HTTP API into
  `.storybook/mocks/api/image_proxy/<entity_id>`.

Plant images are cloud-proxied at runtime, so fetching them needs a token:

- `HA_TOKEN` (**required for plant images**) — a long-lived access token (HA:
  Profile → Security → Long-lived access tokens).
- `HA_URL` (optional) — HA base URL for the HTTP API. Defaults to
  `http://homeassistant.home:8123`.

Put these in a local `.env` (gitignored) or the shell:

```bash
HA_TOKEN=xxxxxxxx HA_URL=http://homeassistant:8123 npm run fetch:mock
```

Without `HA_TOKEN` the script still fetches registries and area/person images and
warns that it is skipping plant images. Downloaded images live under `.storybook/mocks/api/`
and are gitignored.
