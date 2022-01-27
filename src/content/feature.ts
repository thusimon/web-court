import { getDomAttribute, DomAttributeType } from './utils/dom';
import { getGeoFeatures, getNearestRectInfo, getSpacialStatistics, GeoType, SpacialStatisticType, NearestType } from './utils/geo';

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
    if (nearestInfo.distN < 0) {
      return nearestInfo
    }
    nearestInfo.typeN = !!inputDomFeatures[nearestInfo.idxN] ? inputDomFeatures[nearestInfo.idxN].type : 'NONE';
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
