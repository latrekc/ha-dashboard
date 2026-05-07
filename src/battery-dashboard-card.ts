import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { fetchHistoryBetween, type HistoryPoint } from "./history";
import type { BatteryDashboardCardConfig, BatteryDeviceRef } from "./types";

@customElement("ha-battery-dashboard-card")
export class HaBatteryDashboardCard extends LitElement {
  @property({ attribute: false }) public hass!: any;

  @state() private _config!: BatteryDashboardCardConfig;
  @state() private _history: Record<string, HistoryPoint[]> = {};
  @state() private _loading: Record<string, boolean> = {};

  static styles = css`
    :host { display: block; }
    .wrap {
      background: var(--ha-card-background, var(--card-background-color));
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, none);
      padding: 12px;
    }
    .title { font-size: 16px; font-weight: 600; margin: 4px 4px 12px; }

    .grid { display: grid; gap: 12px; }
    .device {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      background: rgba(127,127,127,0.08);
      padding: 12px;
      min-height: 120px;
    }
    .bg { position: absolute; inset: 0; opacity: 0.35; pointer-events: none; }
    .top { position: relative; display: flex; justify-content: space-between; gap: 8px; align-items: baseline; }
    .name { font-weight: 600; line-height: 1.2; }
    .meta { opacity: 0.85; font-size: 12px; margin-top: 6px; position: relative; line-height: 1.35; }
    .bar { margin-top: 10px; height: 10px; border-radius: 999px; background: rgba(127,127,127,0.25); overflow: hidden; }
    .fill { height: 100%; border-radius: 999px; }
    .pct { font-variant-numeric: tabular-nums; opacity: 0.85; font-size: 12px; }

    .labels { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 6px; position: relative; }
    .label { font-size: 11px; padding: 2px 8px; border-radius: 999px; background: rgba(127,127,127,0.18); }
  `;

  setConfig(config: BatteryDashboardCardConfig) {
    if (!config.devices) throw new Error("ha-battery-dashboard-card: missing devices[] (provided by strategy)");
    if (!config.start_ts || !config.end_ts) throw new Error("ha-battery-dashboard-card: missing start_ts/end_ts");

    this._config = {
      title: "Battery Devices",
      columns: 3,
      ...config,
    };
  }

  protected updated(changed: Map<string, any>) {
    if (changed.has("hass")) void this.ensureHistories();
    if (changed.has("_config")) void this.ensureHistories();
  }

  private clampPct(x: number) {
    return Math.max(0, Math.min(100, x));
  }

  private batteryColor(pct: number) {
    if (pct > 66) return "#388e3c";
    if (pct > 33) return "#f57c00";
    return "#d32f2f";
  }

  private async ensureHistories() {
    if (!this.hass || !this._config) return;

    const { start_ts, end_ts } = this._config;

    for (const dev of this._config.devices) {
      const eid = dev.battery_entity_id;
      if (this._history[eid] || this._loading[eid]) continue;

      this._loading = { ...this._loading, [eid]: true };
      try {
        const pts = await fetchHistoryBetween(this.hass, eid, start_ts, end_ts);
        this._history = { ...this._history, [eid]: pts };
      } catch {
        this._history = { ...this._history, [eid]: [] };
      } finally {
        this._loading = { ...this._loading, [eid]: false };
      }
    }
  }

  private renderSparkline(points: HistoryPoint[], stroke: string) {
    if (!points?.length) return nothing;

    const w = 600, h = 180;
    const minX = points[0].ts;
    const maxX = points[points.length - 1].ts;

    const sx = (ts: number) => (maxX === minX ? 0 : ((ts - minX) / (maxX - minX)) * w);
    const sy = (v: number) => h - (this.clampPct(v) / 100) * h;

    const d = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.ts).toFixed(1)} ${sy(p.value).toFixed(1)}`)
      .join(" ");

    return html`
      <svg class="bg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
        <path d="${d}" fill="none" stroke="${stroke}" stroke-width="4" opacity="0.9"></path>
      </svg>
    `;
  }

  private renderDevice(dev: BatteryDeviceRef) {
    const st = this.hass?.states?.[dev.battery_entity_id];
    const pctRaw = st ? Number(st.state) : NaN;
    const pct = Number.isFinite(pctRaw) ? this.clampPct(pctRaw) : NaN;

    const color = Number.isFinite(pct) ? this.batteryColor(pct) : "rgba(127,127,127,0.5)";
    const history = this._history[dev.battery_entity_id] ?? [];

    return html`
      <div class="device">
        ${this.renderSparkline(history, color)}

        <div class="top">
          <div class="name">${dev.name}</div>
          <div class="pct">${Number.isFinite(pct) ? `${pct}%` : "—"}</div>
        </div>

        <div class="meta">
          Type: <b>${dev.type}</b><br />
          Area: <b>${dev.area_name ?? dev.area_id ?? "—"}</b><br />
          Entity: <code>${dev.battery_entity_id}</code>
        </div>

        <div class="bar">
          <div class="fill" style="width:${Number.isFinite(pct) ? pct : 0}%; background:${color};"></div>
        </div>

        ${dev.labels?.length
          ? html`<div class="labels">
              ${dev.labels.map((l) => html`<span class="label">${l}</span>`)}
            </div>`
          : nothing}
      </div>
    `;
  }

  render() {
    if (!this._config || !this.hass) return html``;

    const cols = this._config.columns ?? 3;

    return html`
      <ha-card class="wrap">
        ${this._config.title ? html`<div class="title">${this._config.title}</div>` : nothing}

        <div class="grid" style="grid-template-columns: repeat(${cols}, minmax(220px, 1fr));">
          ${this._config.devices.map((d) => this.renderDevice(d))}
        </div>
      </ha-card>
    `;
  }
}