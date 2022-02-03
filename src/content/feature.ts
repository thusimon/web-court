import { 
  DomAttributeType,
  CSSPropertyType,
  findVisibleInputs,
  findUsernameInputs,
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
  SpacialStatisticType,
  getSpacialStatistics,
} from './utils/statistics';

export type InputRawType = {
  input: HTMLInputElement;
};

export type InputFeature = GeoType &
  NearestType &
  DomAttributeType &
  CSSPropertyType;

export type GeneralNumberFeature = {
  [key: string]: number;
}

export type PageFeature = GeneralNumberFeature;

export type AllFeature = {
  inputFeatures: InputFeature[],
  pageFeature: PageFeature
}

export const getInputFieldFeatures = (input: HTMLInputElement): InputFeature => {
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

export const appendFeatureNames = (prefix: string, features: GeneralNumberFeature) => {
  const appendedFeatures: GeneralNumberFeature = {}
  for (const key in features) {
    appendedFeatures[`${prefix}${key}`] = features[key];
  }
  return appendedFeatures;
}

export const getPageFeatures = (): GeneralNumberFeature => {
  // get spacial feature for all inputs
  const allVisiableInputs = findVisibleInputs();
  const spacialStatisticsAll = getSpacialStatistics(allVisiableInputs);
  const spacialStatisticsAllFeature = appendFeatureNames('a-', spacialStatisticsAll);

  // get spacial feature for all username inputs
  const usernameInputs = findUsernameInputs(allVisiableInputs);
  const spacialStatisticsUsername = getSpacialStatistics(usernameInputs);
  const spacialStatisticsUsernameFeature = appendFeatureNames('u-', spacialStatisticsUsername);

  // get spacial feature for all password inputs
  const passwordInputs = findPasswordInputs(allVisiableInputs);
  const spacialStatisticsPassword = getSpacialStatistics(passwordInputs);
  const spacialStatisticsPasswordFeature = appendFeatureNames('p-', spacialStatisticsPassword);

  // get input counts
  const inputCounts = {
    allCount: allVisiableInputs.length,
    usernameCount: usernameInputs.length,
    passwordCount: passwordInputs.length
  }

  return {
    ...spacialStatisticsAllFeature,
    ...spacialStatisticsUsernameFeature,
    ...spacialStatisticsPasswordFeature,
    ...inputCounts
  };
}
