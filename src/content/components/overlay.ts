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
  index?: number,
  backgroundColor: string,
  color?: string,
  callback?: (evt: MouseEvent) => void
};

@customElement('wc-overlay')
class Overlay extends LitElement {
  static styles = css`
    :host {
      display: inline-block !important;
      position: relative !important;
      height: 0px !important;
      width: 0px !important;
      padding: 0px !important;
      margin: 0px !important;
      border: 0 !important;
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
    .btn {
      cursor: pointer;
    }
    .rect {
      display: flex;
      justify-content: center;
      align-items: center;
      user-select: none;
      cursor: move;
      border: 2px solid black;
    }
    .label {
      border-width: 2px;
      border-style: solid;
      border-color: var(--settings-color);
    }
    .label-title {
      top: -28px;
      position: relative;
      left: 0px;
      color: var(--settings-color);
    }
    .rect-anchor {
      position: absolute;
      top: calc(var(--settings-top) + var(--settings-height) - 5px);
      left: calc(var(--settings-left) + var(--settings-width) - 5px);
      width: 20px;
      height: 20px;
      border-radius: 50%;
      cursor: crosshair;
      background: red;
    }
  `;

  @state() public settings: OverlaySettingsType = DEFAULT_OVERLAY_SETTINGS
  changeType: string;
  callback: (evt: MouseEvent) => void;

  render() {
    return this.content;
  }

  get content() {
    const {mode, text, top, left, width, height, backgroundColor, index, color} = this.settings;
    this.style.setProperty('--settings-top', `${top}px`);
    this.style.setProperty('--settings-left', `${left}px`);
    this.style.setProperty('--settings-width', parseToPixels(width, 'max-content'));
    this.style.setProperty('--settings-height', parseToPixels(height, 'auto'));
    this.style.setProperty('--settings-backgroundColor', backgroundColor);
    this.style.setProperty('--settings-color', color);
    switch (mode) {
      case OVERLAY_MODE.TOOLTIP:
        return html`<div id="${WEBCOURT_UID}-tooltip" class="content">${text}</div>`;
      case OVERLAY_MODE.RECT:
        return html`<div id="${WEBCOURT_UID}-rect" class="content rect"
          @mousedown="${this.onMouseDown}"
          @mouseup="${this.onMouseUp}"
          @mousemove="${this.onMouseMove}"
        >
          ${text}
        </div>
        <div id="${WEBCOURT_UID}-rect-resize-anchor" class="rect-anchor"
          @mousedown="${this.onMouseDown}"
          @mouseup="${this.onMouseUp}"
          @mousemove="${this.onMouseMove}"
        ></div>`;
      case OVERLAY_MODE.BUTTON:
        return html`<button id="${WEBCOURT_UID}-btn" class="content btn"
          @click="${this.onClick}"
        >${text}</button>`
      case OVERLAY_MODE.LABEL:
        return html`<div id="${WEBCOURT_UID}-label-${index}" class="content label">
          <div class="label-title">${text}</div>
        </div>`
      default:
        return html``;
    }
  }

  updateSettings(settings: OverlaySettingsType) {
    this.settings = settings;
    if (settings.callback) {
      this.callback = settings.callback;
    }
  }

  onMouseDown(evt: MouseEvent) {
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

  onMouseUp(evt: MouseEvent) {
    this.changeType = '';
  }

  onMouseMove(evt: MouseEvent) {
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

  onClick(evt: MouseEvent) {
    if(this.callback) {
      this.callback(evt);
    }
  }

  async clear() {
    this.settings = DEFAULT_OVERLAY_SETTINGS;
    let complete = false;
    try {
      complete = await this.updateComplete
    } catch (e) {
      // 
    }
    return complete;
  }
}

export default Overlay;
