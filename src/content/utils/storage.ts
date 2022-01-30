import * as browser from 'webextension-polyfill';
import { InputFeature } from '../feature';
import { LabelData } from '../message';
import { FeatureCategory } from '../../constants';

export type InputFeatureLabeled = InputFeature & LabelData

export const addInputFeature = async (inputFeature: InputFeatureLabeled) => {
  try {
    const storageGet = await browser.storage.local.get(FeatureCategory.Field);
    const currentFieldFeatures = storageGet[FeatureCategory.Field] || [];
    currentFieldFeatures.push(inputFeature);
    await browser.storage.local.set({ [FeatureCategory.Field]: currentFieldFeatures});
    return Promise.resolve(true);
  } catch (e) {
    return Promise.reject(false);
  }
};
