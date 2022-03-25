import _ from 'lodash';
import * as tf from '@tensorflow/tfjs';
import { GeneralFeatureLabeled } from '../../storage'
import { FeatureCategory } from '../../../constants';
import { processButtonFeature } from './process-button-data';

export const PageClass = ['login', 'other'];
export const ButtonClass = ['submit', 'other'];

export type ValueList = ValueType[];

export type ValueType = number | string | boolean;
export interface FeatureValueList {
  [key: string]: ValueList;
};

export const toOneHot = (feature: number[], classLength: number) => {
  // Create a 1D `tf.Tensor` to hold the labels, and convert the number label
  // from the set {0, 1, 2} into one-hot encoding (.e.g., 0 --> [1, 0, 0]).
  return tf.oneHot(tf.tensor1d(feature).toInt(), classLength);
};

export const skipProps = (features: GeneralFeatureLabeled[], excludeProps: string[]): GeneralFeatureLabeled[] => {
  return features.map(feature => _.omit(feature, excludeProps));
}

export const convertFeatureToArray = (features: GeneralFeatureLabeled[]): ValueType[][] => {
  const uniqueLabels = _.uniq(features.map(f => f.label));
  return features.map(feature => {
    const label = uniqueLabels.indexOf(feature.label);
    const cleanedFeature = _.omit(feature, ['label']);
    const featureValues = _.values(cleanedFeature);
    return [...featureValues, label];
  });
};

export const convertToTensors = (data: number[][], targets: number[], testSplit: number, classLength: number, shuffle: boolean = true) => {
  const numExamples = data.length;
  if (numExamples !== targets.length) {
    throw new Error('data and split have different numbers of examples');
  }

  // Randomly shuffle `data` and `targets`.
  const indices = [];
  for (let i = 0; i < numExamples; ++i) {
    indices.push(i);
  }
  if (shuffle) {
    tf.util.shuffle(indices);
  }

  const shuffledData = [];
  const shuffledTargets = [];
  for (let i = 0; i < numExamples; ++i) {
    shuffledData.push(data[indices[i]]);
    shuffledTargets.push(targets[indices[i]]);
  }

  // Split the data into a training set and a tet set, based on `testSplit`.
  const numTestExamples = Math.round(numExamples * testSplit);
  const numTrainExamples = numExamples - numTestExamples;

  const xDims = (shuffledData[0] || []).length;

  // Create a 2D `tf.Tensor` to hold the feature data.
  const xs = tf.tensor2d(shuffledData, [numExamples, xDims]);

  // Create a 1D `tf.Tensor` to hold the labels, and convert the number label
  // from the set {0, 1, 2} into one-hot encoding (.e.g., 0 --> [1, 0, 0]).
  const ys = toOneHot(shuffledTargets, classLength);

  // Split the data into training and test sets, using `slice`.
  const xTrain = xs.slice([0, 0], [numTrainExamples, xDims]);
  const xTest = xs.slice([numTrainExamples, 0], [numTestExamples, xDims]);
  const yTrain = ys.slice([0, 0], [numTrainExamples, classLength]);
  const yTest = ys.slice([0, 0], [numTestExamples, classLength]);
  return [xTrain, yTrain, xTest, yTest];
};

export const getFeatureData = (features: GeneralFeatureLabeled[], featureClasses: string[], testSplit: number, shuffle: boolean = true) => {
  const arrData = convertFeatureToArray(features);
  const classLength = featureClasses.length;
  return tf.tidy(() => {
    const dataByClass = [];
    const targetsByClass = [];
    for (let i = 0; i < classLength; ++i) {
      dataByClass.push([]);
      targetsByClass.push([]);
    }
    for (const example of arrData) {
      const target = example[example.length - 1] as number;
      const data = example.slice(0, example.length - 1);
      dataByClass[target].push(data);
      targetsByClass[target].push(target);
    }

    const xTrains = [];
    const yTrains = [];
    const xTests = [];
    const yTests = [];
    for (let i = 0; i < classLength; ++i) {
      const [xTrain, yTrain, xTest, yTest] =
          convertToTensors(dataByClass[i], targetsByClass[i], testSplit, classLength, shuffle);
      xTrains.push(xTrain);
      yTrains.push(yTrain);
      xTests.push(xTest);
      yTests.push(yTest);
    }

    const concatAxis = 0;
    return [
      tf.concat(xTrains, concatAxis), tf.concat(yTrains, concatAxis),
      tf.concat(xTests, concatAxis), tf.concat(yTests, concatAxis)
    ];
  });
};

export const getFeatureDataByCategory = (features: GeneralFeatureLabeled[], featureCategory: FeatureCategory, testSplit: number = 0.1) => {
  switch (featureCategory) {
    case FeatureCategory.Page:
    case FeatureCategory.Inputs: {
      const cleanedFeatures = skipProps(features, ['url', 'tagDiscriptor']);
      return getFeatureData(cleanedFeatures, PageClass, testSplit, true);
    }
    case FeatureCategory.Buttons:
      const buttonFeatures = processButtonFeature(features);
      const cleanedFeatures = skipProps(buttonFeatures, ['url', 'tagDiscriptor', 'value', 'tagName', 'disabled', 'type']);
      return getFeatureData(cleanedFeatures, ButtonClass, testSplit, true);
    default:
      break;
  }
};
