import { storage } from 'webextension-polyfill';
import { InputFeature } from '../feature';
import { LabelData } from '../message';
import { FeatureCategory } from '../../constants';

export type InputFeatureLabeled = InputFeature & LabelData

export const addInputFeature = async (inputFeature: InputFeatureLabeled) => {
  try {
    const storageGet = await storage.local.get(FeatureCategory.Field);
    const currentFieldFeatures = storageGet[FeatureCategory.Field] || [];
    currentFieldFeatures.push(inputFeature);
    await storage.local.set({ [FeatureCategory.Field]: currentFieldFeatures});
    return Promise.resolve(true);
  } catch (e) {
    return Promise.reject(false);
  }
};

export const getFieldFeatures = async () => {
  try {
    const storageGet = await storage.local.get(FeatureCategory.Field);
    return storageGet[FeatureCategory.Field] || [];
  } catch (e) {
    return [];
  }
};

export const getPageFeatures = async () => {
  try {
    const storageGet = await storage.local.get(FeatureCategory.Page);
    return storageGet[FeatureCategory.Page] || [];
  } catch (e) {
    return [];
  }
}
