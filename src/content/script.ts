import '@webcomponents/webcomponentsjs';
import { findVisibleInputs,
  highlightPendingDom,
  highlightLabeledDom,
  restoreDomHighlight,
  addBasicInfoUnderDom,
} from './utils/dom';
import { getInputFieldsFeatures, getPageFeatures } from './feature';
import './components/overlay';

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
  const target = evt.target;
  if (!target || !(target instanceof HTMLElement)) {
    console.log('Not HTMLElement');
    return;
  }
  currentSelectedDom = target;
  highlightPendingDom(target);
  addBasicInfoUnderDom(target);
});

document.addEventListener('keyup', (evt) => {
})

const overlay = document.createElement('wc-overlay');
document.body.append(overlay);
