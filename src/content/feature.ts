import { getDomAttribute } from './utils/dom';
import { GeoSpacialType, getNomalizedRects, getNearestRect } from './utils/geo';

export type InputRawType = {
  input: HTMLInputElement;
};

export type InputFeature = GeoSpacialType & InputRawType;

export const getInputFieldsFeature = (inputs: HTMLInputElement[]): InputFeature[] => {
  // get geo features
  const inputGeoRects = getNomalizedRects(inputs);
  const inputGeoFeatures = inputGeoRects.map(f => getNearestRect(f, inputGeoRects));
  
  // get dom features
  const inputDomFeatures = getDomAttribute(inputs);

  // merge all the features
  const inputFeatures: InputFeature[] = inputs.map((input, idx) => {
    return {
      input,
      ...inputGeoFeatures[idx],
      ...inputDomFeatures[idx]
    }
  })
  return inputFeatures;
}
