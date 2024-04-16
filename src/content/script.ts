import '@webcomponents/webcomponentsjs';
import * as browser from 'webextension-polyfill';
import {
  findVisibleInputs,
  findUsernameInputs,
  findPasswordInputs,
  restoreDomHighlight,
  addTooltipUnderDom,
  clearOverlay,
  highlightLabeledDoms,
  addLabelOnPage,
  getColorByConfidence
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
  //addTooltipUnderDom(currentSelectedDom, overlay);
});

// setInterval(() => {
//   const allVisiableInputs = findVisibleInputs();
//   const textInputs = findUsernameInputs(allVisiableInputs);
//   const passwordInputs = findPasswordInputs(allVisiableInputs);
//   highlightLabeledDoms([...textInputs, ...passwordInputs], 'green');
// }, 1000);

document.addEventListener('keyup', (evt) => {
  //TODO use +/- to navigate to parent/children
});

// add overlay at the bottom of the body
const overlay = document.createElement('wc-overlay') as Overlay;
const overlayRectForm = document.createElement('wc-overlay') as Overlay;
const overlayRectButton = document.createElement('wc-overlay') as Overlay;
const overlaySaveButton = document.createElement('wc-overlay') as Overlay;

overlay.id = `${WEBCOURT_UID}-overlay`;
overlayRectForm.id = `${WEBCOURT_UID}-overlayForm`;
overlayRectButton.id = `${WEBCOURT_UID}-overlayButton`;
overlaySaveButton.id = `${WEBCOURT_UID}-overlaySave`;

const createPersistOverlay = (index: number) => {
  const overlay = document.createElement('wc-overlay') as Overlay;
  overlay.id = `${WEBCOURT_UID}-overlay-persist-${index}`;
  document.body.append(overlay);
  return overlay;
};

const overlays = [overlay, overlayRectForm, overlayRectButton, overlaySaveButton];
document.body.append(...overlays);

// register message listener
browser.runtime.onMessage.addListener((message: Message, sender: browser.Runtime.MessageSender) => {
  switch (message.type) {
    case MessageType.CONTEXT_CLICK: {
      return handleLabel(message, currentSelectedDom, overlays);
    }
    case MessageType.BTN_FEATURE_COLLECT: {
      handlePredict(message);
      break;
    }
    case MessageType.PREDICT_RESULT: {
      const data = message.data;
      const windowWidth = window.screen.width;
      const windowHeight = window.screen.height;
      console.log(72, message, windowWidth, windowHeight, window.innerWidth, window.innerHeight);
      data.forEach((d: any, index: number) => {
        const {box, klass, score, ratios} = d;
        const {modelWidth, modelHeight} = ratios;
        let [x1, y1, x2, y2] = box;
        // rescale 640*640 coordinates to windowWidth*windowHeight
        const modelRatio = modelWidth / modelHeight;
        //const windowRatio = windowWidth / windowHeight;
        const windowRatio = window.innerWidth / window.innerHeight
        const windowModelRatio = windowRatio / modelRatio;
        x1 *= windowModelRatio;
        x2 *= windowModelRatio;
        const newModelWidth = windowModelRatio * modelWidth;
        const scaler = windowWidth / newModelWidth;
        x1 *= scaler;
        y1 *= scaler;
        x2 *= scaler;
        y2 *= scaler;
        // rescale 
        d.box = [x1, y1, x2, y2];
        const overlay = createPersistOverlay(index);
        const overlayPos = overlay.getBoundingClientRect();
        const color = getColorByConfidence(score);
        addLabelOnPage(overlay, y1 - overlayPos.top, x1 - overlayPos.left, `${klass}: ${score.toFixed(5)}`, x2 - x1, y2 - y1, index, color);
      })
      console.log(69, message);
      break;
    }
    default:
      break;
  }
});
