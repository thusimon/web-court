import { 
  DomAttributeType,
  CSSPropertyType,
  findVisibleInputs,
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


export type PageFeature = SpacialStatisticType;

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

export const getPageFeatures = (): PageFeature => {
  const allVisiableInputs = findVisibleInputs();
  const inputsGeoFeatures = allVisiableInputs.map(input => getGeoFeature(input));

  // get spacial feature
  const spacialStatisticsFeature = getSpacialStatistics(inputsGeoFeatures);

  return {
    ...spacialStatisticsFeature
  }
}
