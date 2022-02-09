import { 
  DomAttributeType,
  CSSPropertyType,
  findVisibleInputs,
  findtextInputs,
  findPasswordInputs,
  getDomAttributes,
  getCSSProperties
} from './utils/dom';
import {
  GeoType,
  NearestType,
  getGeoFeature,
  getNearestInfo
} from './utils/geo';
import {
  getSpacialStatistics,
} from './utils/statistics';

export interface InputFeature extends GeoType, NearestType, DomAttributeType, CSSPropertyType {}

export interface GeneralFeature {
  [key: string]: number | string | boolean;
}

export interface PageFeature extends GeneralFeature {}

export interface AllFeature {
  inputFeatures: GeneralFeature[],
  pageFeature: GeneralFeature
}

export const getInputFieldFeatures = (input: HTMLInputElement): GeneralFeature => {
  const allVisiableInputs = findVisibleInputs();
  // get geo features
  const inputGeoFeatures = getGeoFeature(input);
  // get dom features
  const inputDomFeatures = getDomAttributes(input);
  // get nearest features
  const inputNearestFeatures = getNearestInfo(input, allVisiableInputs);
  // get css features
  const inputCSSFeatures = getCSSProperties(input);

  // merge all the features
  return {
    ...inputDomFeatures,
    ...inputGeoFeatures,
    ...inputNearestFeatures,
    ...inputCSSFeatures,
  }
}

export const appendFeatureNames = (prefix: string, features: GeneralFeature) => {
  const appendedFeatures: GeneralFeature = {}
  for (const key  in features) {
    appendedFeatures[`${prefix}${key}`] = features[key];
  }
  return appendedFeatures;
}

export const getPageFeatures = (): GeneralFeature => {
  // get spacial feature for all inputs
  const allVisiableInputs = findVisibleInputs();
  //const spacialStatisticsAll = getSpacialStatistics(allVisiableInputs);
  //const spacialStatisticsAllFeature = appendFeatureNames('a-', spacialStatisticsAll);

  // get spacial feature for all username inputs
  const usernameInputs = findtextInputs(allVisiableInputs);
  const spacialStatisticsUsername = getSpacialStatistics(usernameInputs);
  const spacialStatisticsUsernameFeature = appendFeatureNames('u-', spacialStatisticsUsername);

  // get spacial feature for all password inputs
  const passwordInputs = findPasswordInputs(allVisiableInputs);
  const spacialStatisticsPassword = getSpacialStatistics(passwordInputs);
  const spacialStatisticsPasswordFeature = appendFeatureNames('p-', spacialStatisticsPassword);

  // get input counts
  const inputCounts = {
    allCount: allVisiableInputs.length,
    textCount: usernameInputs.length,
    passwordCount: passwordInputs.length
  }

  return {
    ...spacialStatisticsUsernameFeature,
    ...spacialStatisticsPasswordFeature,
    ...inputCounts
  };
}

export const constructPageFeatureOrdered = (feature: GeneralFeature) => {
  // extract the ordered key and value
  const orderedKeys = ['label', 'url'];
  Object.keys(feature).forEach(key => {
    if (!orderedKeys.includes(key)) {
      orderedKeys.push(key);
    }
  });
  const orderedValues = orderedKeys.map(key => feature[key]);
  return {
    key: orderedKeys,
    value: orderedValues
  };
};
