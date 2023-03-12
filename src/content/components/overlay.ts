import { LitElement, html, css } from 'lit';
import {customElement, state} from 'lit/decorators.js';
import { WEBCOURT_UID, OVERLAY_MODE, DEFAULT_OVERLAY_SETTINGS } from '../../constants';
import { parseToPixels } from '../utils/numbers';

export type OverlaySettingsType = {
  mode: OVERLAY_MODE,
  text: string,
  top: number,
  left: number,
  width?: number,
  height?: number,
  backgroundColor: string
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
      padding: 0.2rem;
      background: var(--settings-backgroundColor);
      top: var(--settings-top);
      left: var(--settings-left);
      width: var(--settings-width);
      height: var(--settings-height);
    }
    .rect {
      display: flex;
      justify-content: center;
      align-items: center;
      user-select: none;
      cursor: move;
      border: 2px solid black;
    }
    .rect-anchor {
      position: absolute;
      top: calc(var(--settings-top) + var(--settings-height) + 5px);
      left: calc(var(--settings-left) + var(--settings-width) + 5px);
      width: 3px;
      height: 3px;
      border: 3px solid red;
      border-radius: 50%;
      cursor: crosshair;
      background: red;
    }
  `;

  @state() public settings: OverlaySettingsType = DEFAULT_OVERLAY_SETTINGS
  changeType: string;

  render() {
    return this.content;
  }

  get content() {
    const {mode, text, top, left, width, height, backgroundColor} = this.settings;
    this.style.setProperty('--settings-top', `${top}px`);
    this.style.setProperty('--settings-left', `${left}px`);
    this.style.setProperty('--settings-width', parseToPixels(width, 'max-content'));
    this.style.setProperty('--settings-height', parseToPixels(height, 'auto'));
    this.style.setProperty('--settings-backgroundColor', backgroundColor);
    switch (mode) {
      case OVERLAY_MODE.TOOLTIP:
        return html`<div id="${WEBCOURT_UID}-tooltip" class="content">${text}</div>`;
      case OVERLAY_MODE.RECT:
        return html`<div id="${WEBCOURT_UID}-rect" class="content rect"
          @mousedown="${this.mouseDown}"
          @mouseup="${this.mouseUp}"
          @mousemove="${this.mouseMove}"
        >
          ${text}
        </div>
        <div id="${WEBCOURT_UID}-rect-resize-anchor" class="rect-anchor"
          @mousedown="${this.mouseDown}"
          @mouseup="${this.mouseUp}"
          @mousemove="${this.mouseMove}"
        ></div>`;
      default:
        return html``;
    }
  }

  updateSettings(settings: OverlaySettingsType) {
    this.settings = settings;
  }

  mouseDown(evt: MouseEvent) {
    const target = evt.target as HTMLElement;
    switch (target.id) {
      case `${WEBCOURT_UID}-rect`:
        this.changeType = 'move';
        break;
      case `${WEBCOURT_UID}-rect-resize-anchor`:
        this.changeType = 'resize';
        break;
      default:
        this.changeType = '';
        break;
    }
  }

  mouseUp(evt: MouseEvent) {
    this.changeType = '';
  }

  mouseMove(evt: MouseEvent) {
    switch (this.changeType) {
      case 'move': {
        const { movementX, movementY } = evt;
        this.settings.top += movementY;
        this.settings.left += movementX;
        this.style.setProperty('--settings-top', `${this.settings.top}px`);
        this.style.setProperty('--settings-left', `${this.settings.left}px`);
        break;
      }
      case 'resize': {
        const { movementX, movementY } = evt;
        this.settings.width += movementX;
        this.settings.height += movementY;
        this.style.setProperty('--settings-width', `${this.settings.width}px`);
        this.style.setProperty('--settings-height', `${this.settings.height}px`);
        break;
      }
      default: {
        break;
      }
    }
  }

  clear() {
    this.settings = DEFAULT_OVERLAY_SETTINGS;
  }
}

export default Overlay;
