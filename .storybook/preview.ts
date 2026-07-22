import type { Preview } from '@storybook/web-components';
import { html, LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import * as mdiIcons from '@mdi/js';

function mdiNameToPath(icon: string): string {
  if (!icon?.startsWith('mdi:')) return '';
  const camel =
    'mdi' +
    icon
      .slice(4)
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join('');
  return (mdiIcons as Record<string, string>)[camel] || '';
}

if (typeof window !== 'undefined' && !customElements.get('ha-icon')) {
  @customElement('ha-icon')
  class HaIcon extends LitElement {
    @property() icon = '';
    static styles = css`
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      svg {
        width: var(--mdc-icon-size, 24px);
        height: var(--mdc-icon-size, 24px);
        fill: currentColor;
      }
    `;
    render() {
      return html`<svg viewBox="0 0 24 24"><path d="${mdiNameToPath(this.icon)}"></path></svg>`;
    }
  }
}

if (typeof window !== 'undefined' && !customElements.get('ha-tooltip')) {
  @customElement('ha-tooltip')
  class HaTooltip extends LitElement {
    @property() content = '';
    render() {
      return html`<span title=${this.content || ''}><slot></slot></span>`;
    }
  }
}

if (typeof window !== 'undefined' && !customElements.get('ha-card')) {
  @customElement('ha-card')
  class HaCard extends LitElement {
    static styles = css`
      :host {
        display: block;
        background: var(--ha-card-background, #fff);
        border-radius: var(--ha-card-border-radius, 12px);
        box-shadow: var(--ha-card-box-shadow, 0 1px 3px rgba(0, 0, 0, 0.12));
        color: var(--primary-text-color, #212121);
        overflow: hidden;
      }
      :host([hidden]) {
        display: none;
      }
    `;
    render() {
      return html`<slot></slot>`;
    }
  }
}

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'ha-light',
      values: [
        { name: 'ha-light', value: '#fafafa' },
        { name: 'ha-dark', value: '#111827' },
      ],
    },
  },
  decorators: [
    (story) =>
      html`<div
        style="padding:16px;background:#fafafa;--ha-card-background:#ffffff;--card-background-color:#ffffff;--ha-card-border-radius:12px;--primary-text-color:#212121;--secondary-text-color:#666;--disabled-text-color:#999;--ha-S200:#f6f7f9;--ha-S300:#ffffff;--ha-S400:#f2f3f5;--ha-S500:#e6e8eb;--ha-S300-contrast:#1c1c1e;--ha-transition-duration:0.25s;--ha-easing:ease-in-out;--ha-font-family:Roboto,sans-serif;color:#212121;font-family:Roboto,sans-serif;min-height:100vh;"
      >
        ${story()}
      </div>`,
  ],
};
export default preview;
