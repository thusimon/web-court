import _ from 'lodash';
import { GeneralFeature } from '../../../../content/feature';
import { GeneralFeatureLabeled } from '../../../../content/utils/storage';
import { FeatureValueList } from './data';

export enum ButtonFeatureType {
  auxillary,
  label,
  number,
  string,
  category
};

export interface ButtonFeature {
  name: string,
  type: ButtonFeatureType
};

// This varies when collect different features
export const buttonFeatures: ButtonFeature[] = [
  { name: 'label', type: ButtonFeatureType.label },
  { name: 'url', type: ButtonFeatureType.auxillary },
  { name: 'tagDiscriptor', type: ButtonFeatureType.auxillary },
  { name: 'PXheight', type: ButtonFeatureType.number }, // nearest user name and password
  { name: 'PXleft', type: ButtonFeatureType.number },
  { name: 'PXtop', type: ButtonFeatureType.number },
  { name: 'PXwidth', type: ButtonFeatureType.number },
  { name: 'PYheight', type: ButtonFeatureType.number },
  { name: 'PYleft', type: ButtonFeatureType.number },
  { name: 'PYtop', type: ButtonFeatureType.number },
  { name: 'PYwidth', type: ButtonFeatureType.number },
  { name: 'UXheight', type: ButtonFeatureType.number },
  { name: 'UXleft', type: ButtonFeatureType.number },
  { name: 'UXtop', type: ButtonFeatureType.number },
  { name: 'UXwidth', type: ButtonFeatureType.number },
  { name: 'UYheight', type: ButtonFeatureType.number },
  { name: 'UYleft', type: ButtonFeatureType.number },
  { name: 'UYtop', type: ButtonFeatureType.number },
  { name: 'UYwidth', type: ButtonFeatureType.number},
  { name: 'borderRadius', type: ButtonFeatureType.number }, // css
  { name: 'colorB', type: ButtonFeatureType.number },
  { name: 'colorG', type: ButtonFeatureType.number },
  { name: 'colorR', type: ButtonFeatureType.number },
  { name: 'left', type: ButtonFeatureType.number }, // geometry
  { name: 'top', type: ButtonFeatureType.number },
  { name: 'width', type: ButtonFeatureType.number },
  { name: 'height', type: ButtonFeatureType.number },
  // string and categorical feature
  { name: 'id', type: ButtonFeatureType.string }, // dom
  { name: 'name', type: ButtonFeatureType.string },
  { name: 'tagName', type: ButtonFeatureType.category },
  { name: 'value', type: ButtonFeatureType.string },
  { name: 'textContent', type: ButtonFeatureType.string },
  { name: 'type', type: ButtonFeatureType.category },
  { name: 'className', type: ButtonFeatureType.string },
  { name: 'disabled', type: ButtonFeatureType.category },
  { name: 'samePassXY', type: ButtonFeatureType.category },
  { name: 'sameUserXY', type: ButtonFeatureType.category }
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
    featureRanges[cn].sort();
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
  /continue\W*$/i,
  /next\W*$/i,
  /submit\W*$/i,
  /go\W*$/i,
  /ok\W*$/i,
  /save\W*$/i,
];

export const processStringFeature = (features: GeneralFeatureLabeled[]) => {
  features.forEach(feature => {
    const id = feature.id as string;
    feature.id = submitButtonContentRegexes.some(submitRegex => submitRegex.test(id));
    const name = feature.name as string;
    feature.name = submitButtonContentRegexes.some(submitRegex => submitRegex.test(name));
    const className = feature.className as string;
    feature.className = submitButtonContentRegexes.some(submitRegex => submitRegex.test(className));
    const textContent = feature.textContent as string;
    feature.textContent = submitButtonContentRegexes.some(submitRegex => submitRegex.test(textContent));
    const value = feature.value as string;
    feature.value = submitButtonContentRegexes.some(submitRegex => submitRegex.test(value));
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
  // e.g tagName = ['input', 'button', 'a'] => [0, 1, 2]
  // convert to oneHot encode if necessary
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
  processStringFeature,
  processCategoryFeature
]);
