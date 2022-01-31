import { LitElement, html, css } from 'lit';
import {customElement, state} from 'lit/decorators.js';
import { WEBCOURT_UID, OVERLAY_MODE, DEFAULT_OVERLAY_SETTINGS } from '../../constants';

export type OverlaySettingsType = {
  mode: OVERLAY_MODE,
  text: string,
  top: number,
  left: number
};

@customElement('wc-overlay')
class Overlay extends LitElement {
  static styles = css`
    :host {
      display: inline-block !important;
      position: relative !important;
      height: 0px !important;
      width: auto !important;
      padding: 0px !important;
      margin: 0px !important;
      z-index: 2147483647 !important;
    }
    .content {
      position: absolute;
      font-size: 1.2rem;
      box-shadow: 0 3px 10px rgb(0 0 0 / 0.3);
      background: cornsilk;
      width: max-content;
      padding: 0.2rem;
      top: var(--settings-top);
      left: var(--settings-left);
    }
  `;

  @state() public settings: OverlaySettingsType = DEFAULT_OVERLAY_SETTINGS

  render() {
    return this.content;
  }

  get content() {
    const {mode, text, top, left} = this.settings;
    this.style.setProperty('--settings-top', `${top}px`);
    this.style.setProperty('--settings-left', `${left}px`);
    switch (mode) {
      case OVERLAY_MODE.TOOLTIP:
        return html`
          <div id="${WEBCOURT_UID}-tooltip" class="content">${text}</div>
        `;
      default:
        return html``;
    }
  }

  updateSettings(settings: OverlaySettingsType) {
    this.settings = settings;
  }

  clear() {
    this.settings = DEFAULT_OVERLAY_SETTINGS;
  }
}

export default Overlay;
