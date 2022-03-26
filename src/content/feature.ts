import _ from 'lodash';
import { 
  DomAttributeType,
  CSSPropertyType,
  findVisibleInputs,
  findUsernameInputs,
  findPasswordInputs,
  getDomAttributes,
  getCSSProperties,
  getCanvasImageData
} from './utils/dom';
import {
  GeoType,
  NearestType,
  getGeoFeature,
  getNearestInfo,
  getUsernamePasswordGeoFeature,
  SpacialType,
  sortElementsByDistanceOnAxis,
  getOffset
} from './utils/geo';
import { getDominateColor } from './utils/image';
import {
  getSpacialStatistics,
} from './utils/statistics';

export interface InputFeature extends GeoType, NearestType, DomAttributeType, CSSPropertyType {};

export interface GeneralFeature {
  [key: string]: number | string | boolean;
};

export interface PageFeature extends GeneralFeature {};

export interface AllFeature {
  inputFeatures: GeneralFeature[],
  pageFeature: GeneralFeature
};

export const getInputFeatures = (input: HTMLElement, inputs: HTMLInputElement[]): GeneralFeature => {
  // get geo features
  const inputGeoFeatures = getGeoFeature(input);
  // get dom features
  const inputDomFeatures = getDomAttributes(input);
  // get nearest features
  const inputNearestFeatures = getNearestInfo(input, inputs);
  // get css features
  const inputCSSFeatures = getCSSProperties(input);

  // merge all the features
  return {
    ...inputDomFeatures,
    ...inputGeoFeatures,
    ...inputNearestFeatures,
    ...inputCSSFeatures,
  }
};

export const buttonCSSProperties = ['borderRadius'];

export const getButtonFeatures = async (button: HTMLElement, inputs: HTMLInputElement[], useRatio: boolean = true): Promise<GeneralFeature> => {
  // get geo features
  const buttonGeoFeatures = getGeoFeature(button, useRatio);
  // get dom features
  const buttonDomFeatures = getDomAttributes(button);
  // get css features
  const buttonCSSFeatures = _.pick(getCSSProperties(button), buttonCSSProperties);
  // get canvas features;
  // TODO: canvas feature has big overhead to collect. May skip it in production
  // const buttonCanvasFeatures = await getCanvasImageData(button);
  // const buttonColor = getDominateColor(buttonCanvasFeatures);
  // get sorted username inputs
  const usernameInputs = findUsernameInputs(inputs);
  const usernameInputsSortedByDistance = sortElementsByDistanceOnAxis(button, usernameInputs, true, 2) as HTMLInputElement[];
  const usernameInputNearest = usernameInputsSortedByDistance[0];
  const usernameInputNearestOffset = getOffset(usernameInputNearest, button, true, 'U');

  // TODO add username and password input length and nearest input index
  
  // get sorted password inputs
  const passwordInputs = findPasswordInputs(inputs);
  const passwordInputsSortedByDistance = sortElementsByDistanceOnAxis(button, passwordInputs, true, 2) as HTMLInputElement[];
  const passwordInputNearest = passwordInputsSortedByDistance[0];
  const passwordInputNearestOffset = getOffset(passwordInputNearest, button, true, 'P');
  
  // merge all the features

  return {
    ...buttonGeoFeatures,
    ...buttonDomFeatures,
    ...buttonCSSFeatures,
    // ...{
    //   colorR: buttonColor[0],
    //   colorG: buttonColor[1],
    //   colorB: buttonColor[2]
    // },
    ...usernameInputNearestOffset,
    ...passwordInputNearestOffset,
  };
};

export const appendFeatureNames = (prefix: string, features: GeneralFeature) => {
  const appendedFeatures: GeneralFeature = {}
  for (const key  in features) {
    appendedFeatures[`${prefix}${key}`] = features[key];
  }
  return appendedFeatures;
};

export const getPageFeatures = (): GeneralFeature => {
  // get spacial feature for all inputs
  const allVisiableInputs = findVisibleInputs();
  //const spacialStatisticsAll = getSpacialStatistics(allVisiableInputs);
  //const spacialStatisticsAllFeature = appendFeatureNames('a-', spacialStatisticsAll);

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
    textCount: usernameInputs.length,
    passwordCount: passwordInputs.length
  }

  return {
    ...spacialStatisticsUsernameFeature,
    ...spacialStatisticsPasswordFeature,
    ...inputCounts
  };
};

export const getPageUsernamePasswordGeoFeatures = (): GeneralFeature => {
  const visibleInputs = findVisibleInputs();
  const feature = getUsernamePasswordGeoFeature(visibleInputs);
  const pageFeatureMapped: GeneralFeature = {};
  feature.forEach((f, idx) => {
    Object.keys(f).forEach((key: keyof SpacialType) => {
      pageFeatureMapped[`${idx}${key}`] = f[key];
    })
  });
  return pageFeatureMapped;
};

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
