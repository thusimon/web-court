import '@webcomponents/webcomponentsjs';
import * as browser from 'webextension-polyfill';
import {
  highlightPendingDom,
  restoreDomHighlight,
  addTooltipUnderDom,
  clearOverlay
} from './utils/dom';
import { handleLabel } from './message';
import './components/overlay';
import Overlay from './components/overlay';
import { WEBCOURT_UID, Message, MessageType } from '../constants';

let currentSelectedDom: HTMLElement;
document.addEventListener('contextmenu', (evt) => {
  if (currentSelectedDom) {
    restoreDomHighlight(currentSelectedDom);
  }
  clearOverlay(overlay);
  const target = evt.target as HTMLElement;
  if (!target) {
    console.log('No HTMLElement');
    return;
  }
  currentSelectedDom = target;
  highlightPendingDom(currentSelectedDom);
  addTooltipUnderDom(currentSelectedDom, overlay);
});

document.addEventListener('keyup', (evt) => {
  //TODO use +/- to navigate to parent/children
});

// add overlay at the bottom of the body
const overlay = document.createElement('wc-overlay') as Overlay;
overlay.id = `${WEBCOURT_UID}-overlay`;
document.body.append(overlay);

// register message listener
browser.runtime.onMessage.addListener((message: Message, sender: browser.Runtime.MessageSender) => {
  switch (message.type) {
    case MessageType.CONTEXT_CLICK: {
      handleLabel(message, currentSelectedDom, overlay);
      break;
    }
    default:
      break;
  }
});
