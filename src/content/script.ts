import { findVisibleInputs } from './utils/dom';
import { getInputFieldsFeatures, getPageFeatures } from './feature';

const inputs = findVisibleInputs();
const inputFeatures = getInputFieldsFeatures(inputs);
const pageFeatures = getPageFeatures(inputs);

console.log('showing input features');
console.log(inputFeatures);

console.log('showing page features');
console.log(pageFeatures);
