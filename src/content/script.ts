import { findVisibleInputs, highLightPendingDom, highLightLabeledDom } from './utils/dom';
import { getInputFieldsFeatures, getPageFeatures } from './feature';

const inputs = findVisibleInputs();
const inputFeatures = getInputFieldsFeatures(inputs);
const pageFeatures = getPageFeatures(inputs);

console.log('showing input features');
console.log(inputFeatures);

console.log('showing page features');
console.log(pageFeatures);


document.addEventListener('contextmenu', (evt) => {
  const target = evt.target;
  if (!target || !(target instanceof HTMLElement)) {
    console.log('Not HTMLElement');
    return;
  }
  highLightPendingDom(target);
});
