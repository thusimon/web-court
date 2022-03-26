import _ from 'lodash';
import { GeneralFeature } from '../../../content/feature';
import { GeneralFeatureLabeled } from '../../storage';
import { FeatureValueList } from './data';

export enum ButtonFeatureType {
  label,
  number,
  string,
  category
};

export enum ButtonFeaturePriority {
  active,
  auxillary,
  deprecated
};

export interface ButtonFeature {
  name: string,
  type: ButtonFeatureType,
  priority: ButtonFeaturePriority
};

// This varies when collect different features
export const buttonFeatures: ButtonFeature[] = [
  { name: 'label', type: ButtonFeatureType.label, priority: ButtonFeaturePriority.active },
  { name: 'url', type: ButtonFeatureType.string, priority: ButtonFeaturePriority.auxillary },
  { name: 'tagDiscriptor', type: ButtonFeatureType.string, priority: ButtonFeaturePriority.auxillary },
  { name: 'PXheight', type: ButtonFeatureType.number, priority: ButtonFeaturePriority.deprecated }, // nearest user name and password
  { name: 'PXleft', type: ButtonFeatureType.number, priority: ButtonFeaturePriority.deprecated },
  { name: 'PXtop', type: ButtonFeatureType.number, priority: ButtonFeaturePriority.deprecated },
  { name: 'PXwidth', type: ButtonFeatureType.number, priority: ButtonFeaturePriority.deprecated },
  { name: 'PYheight', type: ButtonFeatureType.number, priority: ButtonFeaturePriority.deprecated },
  { name: 'PYleft', type: ButtonFeatureType.number, priority: ButtonFeaturePriority.deprecated },
  { name: 'PYtop', type: ButtonFeatureType.number, priority: ButtonFeaturePriority.deprecated },
  { name: 'PYwidth', type: ButtonFeatureType.number, priority: ButtonFeaturePriority.deprecated },
  { name: 'UXheight', type: ButtonFeatureType.number, priority: ButtonFeaturePriority.deprecated },
  { name: 'UXleft', type: ButtonFeatureType.number, priority: ButtonFeaturePriority.deprecated },
  { name: 'UXtop', type: ButtonFeatureType.number, priority: ButtonFeaturePriority.deprecated },
  { name: 'UXwidth', type: ButtonFeatureType.number, priority: ButtonFeaturePriority.deprecated },
  { name: 'UYheight', type: ButtonFeatureType.number, priority: ButtonFeaturePriority.deprecated },
  { name: 'UYleft', type: ButtonFeatureType.number, priority: ButtonFeaturePriority.deprecated },
  { name: 'UYtop', type: ButtonFeatureType.number, priority: ButtonFeaturePriority.deprecated },
  { name: 'UYwidth', type: ButtonFeatureType.number, priority: ButtonFeaturePriority.deprecated },
  { name: 'UoffsetX', type: ButtonFeatureType.number, priority: ButtonFeaturePriority.active },
  { name: 'UoffsetY', type: ButtonFeatureType.number, priority: ButtonFeaturePriority.active },
  { name: 'PoffsetX', type: ButtonFeatureType.number, priority: ButtonFeaturePriority.active },
  { name: 'PoffsetX', type: ButtonFeatureType.number, priority: ButtonFeaturePriority.active },
  { name: 'borderRadius', type: ButtonFeatureType.number, priority: ButtonFeaturePriority.active }, // css
  { name: 'colorB', type: ButtonFeatureType.number, priority: ButtonFeaturePriority.deprecated },
  { name: 'colorG', type: ButtonFeatureType.number, priority: ButtonFeaturePriority.deprecated },
  { name: 'colorR', type: ButtonFeatureType.number, priority: ButtonFeaturePriority.deprecated },
  { name: 'left', type: ButtonFeatureType.number, priority: ButtonFeaturePriority.active }, // geometry
  { name: 'top', type: ButtonFeatureType.number, priority: ButtonFeaturePriority.active },
  { name: 'width', type: ButtonFeatureType.number, priority: ButtonFeaturePriority.active },
  { name: 'height', type: ButtonFeatureType.number, priority: ButtonFeaturePriority.active },
  // string and categorical feature
  { name: 'id', type: ButtonFeatureType.string, priority: ButtonFeaturePriority.active }, // dom
  { name: 'name', type: ButtonFeatureType.string, priority: ButtonFeaturePriority.active },
  { name: 'tagName', type: ButtonFeatureType.category, priority: ButtonFeaturePriority.active },
  { name: 'value', type: ButtonFeatureType.string, priority: ButtonFeaturePriority.active },
  { name: 'textContent', type: ButtonFeatureType.string, priority: ButtonFeaturePriority.active },
  { name: 'type', type: ButtonFeatureType.category, priority: ButtonFeaturePriority.deprecated },
  { name: 'className', type: ButtonFeatureType.string, priority: ButtonFeaturePriority.active },
  { name: 'disabled', type: ButtonFeatureType.category, priority: ButtonFeaturePriority.deprecated },
  { name: 'samePassXY', type: ButtonFeatureType.category, priority: ButtonFeaturePriority.deprecated },
  { name: 'sameUserXY', type: ButtonFeatureType.category, priority: ButtonFeaturePriority.deprecated }
];

export const getCategoricalFeatureRange = (features: GeneralFeature[]): FeatureValueList => {
  const categoricalFeatureNames = buttonFeatures
    .filter(bf => bf.type === ButtonFeatureType.category || bf.type === ButtonFeatureType.string)
    .map(bf => bf.name);
  const initVal: FeatureValueList = {}
  const featureRanges = features.reduce((prev, curr) => {
    categoricalFeatureNames.forEach(cn => {
      if (_.isUndefined(curr[cn])) {
        return;
      }
      if (!prev[cn]) {
        prev[cn] = [];
        prev[cn].push(curr[cn]);
      } else if (!prev[cn].includes(curr[cn])) {
        prev[cn].push(curr[cn]);
      }
    });
    return prev;
  }, initVal);
  // sort each value list
  categoricalFeatureNames.forEach(cn => {
    if (featureRanges[cn]) {
      featureRanges[cn].sort();
    }
  });
  return featureRanges;
};

/**
 * Using text content feature is not good, it requires our model to learn the actual content
 * Reasons are:
 *  - high effort to maintain the regex list and its order
 *  - i18n, high effort to support other languages
 *  - the button doesn't have text content
 * Currently we use this feature as a workaround for English websites
 * If there are better features, please discard the text content feature
 */
export const submitButtonContentRegexes: RegExp[] = [
  /^(?!.*forg[o|e]t).*(log\W*[i|o]n)/i,
  /^(?!.*forg[o|e]t).*(sign\W*[i|o]n)/i,
  /(?:\W+|^)submit\W*$/i,
  /(?:\W+|^)continue\W*$/i,
  /(?:\W+|^)next\W*$/i,
  /(?:\W+|^)go\W*$/i,
  /(?:\W+|^)ok\W*$/i,
  /(?:\W+|^)save\W*$/i
];

export const skipNonActiveProperties = (features: GeneralFeatureLabeled[]) => {
  const deprecatedProps = buttonFeatures.filter(bf => bf.priority != ButtonFeaturePriority.active)
    .map(bf => bf.name);
  return features.map(feature => {
    return _.omit(feature, deprecatedProps);
  });
};

export const processStringFeature = (features: GeneralFeatureLabeled[]) => {
  features.forEach(feature => {
    const id = feature.id as string;
    feature.id = submitButtonContentRegexes.some(submitRegex => submitRegex.test(id));
    const name = feature.name as string;
    feature.name = submitButtonContentRegexes.some(submitRegex => submitRegex.test(name));
    const className = feature.className as string;
    feature.className = submitButtonContentRegexes.some(submitRegex => submitRegex.test(className));
    // TODO add textContent string length feature
    const textContent = (feature.textContent || feature.value) as string;
    feature.textContent = submitButtonContentRegexes.some(submitRegex => submitRegex.test(textContent));
  });
  return features;
}

// TODO: nomalize the number feature
// MLP may not need nomalization, but should think about it for other models

export const processCategoryFeature = (features: GeneralFeatureLabeled[]): GeneralFeatureLabeled[] => {
  const categoricalFeatureRange = getCategoricalFeatureRange(features);
  const categoricalFeatureNames = Object.keys(categoricalFeatureRange);
  // categorical feature
  // NOTE: here categorical feature is mapped to index integer
  // e.g tagName = ['input', 'button'] => [0, 1]
  // convert to oneHot encode
  features.forEach(feature => {
    categoricalFeatureNames.forEach(cn => {
      const value = feature[cn];
      const featureRangeOptions = categoricalFeatureRange[cn];
      feature[cn] = featureRangeOptions.indexOf(value);
    });
  });
  return features;
};

export const processButtonFeature = _.flow([
  skipNonActiveProperties,
  processStringFeature,
  processCategoryFeature
]);
