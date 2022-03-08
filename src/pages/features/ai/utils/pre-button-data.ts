import _ from 'lodash';
import * as tf from '@tensorflow/tfjs';
import { GeneralFeature } from '../../../../content/feature';

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
  { name: 'samePassXY', type: ButtonFeatureType.category },
  { name: 'sameUserXY', type: ButtonFeatureType.category },
  { name: 'borderRadius', type: ButtonFeatureType.number }, // css
  { name: 'colorB', type: ButtonFeatureType.number },
  { name: 'colorG', type: ButtonFeatureType.number },
  { name: 'colorR', type: ButtonFeatureType.number },
  { name: 'id', type: ButtonFeatureType.category }, // dom
  { name: 'name', type: ButtonFeatureType.category },
  { name: 'tagName', type: ButtonFeatureType.category },
  { name: 'textContent', type: ButtonFeatureType.category },
  { name: 'type', type: ButtonFeatureType.category },
  { name: 'className', type: ButtonFeatureType.category },
  { name: 'disabled', type: ButtonFeatureType.category },
  { name: 'left', type: ButtonFeatureType.number }, // geometry
  { name: 'top', type: ButtonFeatureType.number },
  { name: 'width', type: ButtonFeatureType.number },
  { name: 'height', type: ButtonFeatureType.number }
];

export const getFeatureByType = (features: ButtonFeature[], type: ButtonFeatureType) => {
  return features.filter(feature => feature.type === type);
};

export const processCategoryFeature = (features: ButtonFeature[]) => {

}

export interface FeatureValueList {
  [key: string]: number[] | string[] | boolean[];
};

export const convertFeatureToTensor = (feature: GeneralFeature, featureRange: FeatureValueList) => {
  // number feature
  const numberFeatureNames = buttonFeatures.filter(bf => bf.type === ButtonFeatureType.number).map(bf => bf.name);
  const numberFeature = _.pick(feature, numberFeatureNames);
  const numberFeatureArr = _.values(numberFeature) as number[];
  const numberFeatureTensor = tf.tensor2d([numberFeatureArr]); // shape 1xn

  // categorical feature
  // NOTE: here categorical feature is mapped to index integer
  // e.g tagName = ['input', 'button', 'a'] => [0, 1, 2]
  // convert to oneHot encode if necessary
  const categoricalFeatureNames = buttonFeatures.filter(bf => bf.type === ButtonFeatureType.category).map(bf => bf.name);
  const categoricalFeature = _.pick(feature, categoricalFeatureNames) as GeneralFeature
  for(const key in categoricalFeature) {
    const value = categoricalFeature[key];
    const featureRangeOptions = featureRange[key] as Array<boolean|number|string> 
    categoricalFeature[key] = featureRangeOptions.indexOf(value);
  }
  const categoricalFeatureArr = _.values(categoricalFeature) as number[];
  const categoricalFeatureTensor = tf.tensor2d([categoricalFeatureArr]);

  //concat number and categorical feature
  // TODO: nomalize the feature
  const allFeature = numberFeatureTensor.concat(categoricalFeatureTensor, 1);
  return allFeature;
};
