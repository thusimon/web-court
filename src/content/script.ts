import { findVisibleInputs } from './utils/dom';
import { getInputFieldsFeature } from './feature';

const inputs = findVisibleInputs();
const features = getInputFieldsFeature(inputs);

console.log(features);
