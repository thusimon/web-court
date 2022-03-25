import '@webcomponents/webcomponentsjs';
import * as browser from 'webextension-polyfill';
import {
  findVisibleInputs,
  findUsernameInputs,
  findPasswordInputs,
  restoreDomHighlight,
  addTooltipUnderDom,
  clearOverlay,
  highlightLabeledDoms
} from './utils/dom';
import { handleLabel, handlePredict } from './message';
import './components/overlay';
import Overlay from './components/overlay';
import { WEBCOURT_UID, Message, MessageType } from '../constants';

let currentSelectedDom: HTMLElement;
document.addEventListener('contextmenu', (evt) => {
  if (currentSelectedDom) {
    //restoreDomHighlight(currentSelectedDom);
  }
  clearOverlay(overlay);
  const target = evt.target as HTMLElement;
  if (!target) {
    console.log('No HTMLElement');
    return;
  }
  currentSelectedDom = target;
  //highlightPendingDom(currentSelectedDom);
  addTooltipUnderDom(currentSelectedDom, overlay);
});

setInterval(() => {
  const allVisiableInputs = findVisibleInputs();
  const textInputs = findUsernameInputs(allVisiableInputs);
  const passwordInputs = findPasswordInputs(allVisiableInputs);
  highlightLabeledDoms([...textInputs, ...passwordInputs], 'green');
}, 1000);

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
    case MessageType.BTN_FEATURE_COLLECT: {
      handlePredict(message);
      break;
    }
    default:
      break;
  }
});
