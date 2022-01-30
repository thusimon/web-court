import '@webcomponents/webcomponentsjs';
import { findVisibleInputs,
  highlightPendingDom,
  highlightLabeledDom,
  restoreDomHighlight,
  addTooltipUnderDom,
} from './utils/dom';
import { getInputFieldsFeatures, getPageFeatures } from './feature';
import './components/overlay';
import Overlay from './components/overlay';
import { WEBCOURT_UID } from '../constants';

const inputs = findVisibleInputs();
const inputFeatures = getInputFieldsFeatures(inputs);
const pageFeatures = getPageFeatures(inputs);

console.log('showing input features');
console.log(inputFeatures);

console.log('showing page features');
console.log(pageFeatures);

let currentSelectedDom: HTMLElement;
document.addEventListener('contextmenu', (evt) => {
  if (currentSelectedDom) {
    restoreDomHighlight(currentSelectedDom);
  }
  const target = evt.target as HTMLElement;
  if (!target) {
    console.log('No HTMLElement');
    return;
  }
  currentSelectedDom = target;
  highlightPendingDom(currentSelectedDom);
  overlay.clearOverlay();
  addTooltipUnderDom(currentSelectedDom, overlay);
});

document.addEventListener('keyup', (evt) => {
  //TODO use +/- to navigate to parent/children
});

// add overlay at the bottom of the body
const overlay = document.createElement('wc-overlay') as Overlay;
overlay.id = `${WEBCOURT_UID}-overlay`;
document.body.append(overlay);
