import { getDomAttribute, DomAttributeType } from './utils/dom';
import { getGeoFeatures, getNearestRectInfo, getSpacialStatistics, GeoType, SpacialStatisticType, NearestType } from './utils/geo';
import { INPUT_TYPE_NONE } from '../constants';

export type InputRawType = {
  input: HTMLInputElement;
};

export type InputFeature = GeoType & InputRawType & NearestType & DomAttributeType;

export type PageFeature = SpacialStatisticType;

export type AllFeature = {
  inputFeatures: InputFeature[],
  pageFeature: PageFeature
}

export const getInputFieldsFeatures = (inputs: HTMLInputElement[]): InputFeature[] => {
  // get geo features
  const inputGeoFeatures: GeoType[] = getGeoFeatures(inputs);
  
  // get dom features
  const inputDomFeatures: DomAttributeType[] = getDomAttribute(inputs);

  // get nearest features
  const inputNearestFeatures: NearestType[] = inputGeoFeatures.map(geo => {
    const nearestInfo = getNearestRectInfo(geo, inputGeoFeatures);
    if (nearestInfo.idxNearestX > -1) {
      nearestInfo.typeNearestX = !!inputDomFeatures[nearestInfo.idxNearestX] ?
        inputDomFeatures[nearestInfo.idxNearestX].type : INPUT_TYPE_NONE;
    }
    if (nearestInfo.idxNearestY > -1) {
      nearestInfo.typeNearestY = !!inputDomFeatures[nearestInfo.idxNearestY] ?
        inputDomFeatures[nearestInfo.idxNearestY].type : INPUT_TYPE_NONE;
    }
    return nearestInfo;
  });
  // merge all the features
  const inputFeatures: InputFeature[] = inputs.map((input, idx) => {
    return {
      input,
      ...inputGeoFeatures[idx],
      ...inputDomFeatures[idx],
      ...inputNearestFeatures[idx]
    }
  })

  return inputFeatures;
}

export const getPageFeatures = (inputs: HTMLInputElement[]): PageFeature => {
  const inputGeoFeatures: GeoType[] = getGeoFeatures(inputs);

  // get spacial feature
  const spacialStatisticsFeature = getSpacialStatistics(inputGeoFeatures);

  return {
    ...spacialStatisticsFeature
  }
}
