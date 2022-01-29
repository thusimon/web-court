import { LitElement, html, css } from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import { WEBCOURT_UID } from '../../constants';

@customElement('wc-overlay')
class Overlay extends LitElement {
  render() {
    return html`
      <div id="${WEBCOURT_UID}-tooltip">This is my tooltip</div>
    `;
  }
}

export default Overlay;
