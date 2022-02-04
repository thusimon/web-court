import { storage } from 'webextension-polyfill';
import { GeneralFeature } from '../feature';
import { LabelData } from '../message';
import { FeatureCategory } from '../../constants';

export type GeneralFeatureLabeled = GeneralFeature & LabelData;

export const addFeature = async (category: FeatureCategory, feature: GeneralFeature) => {
  try {
    const storageGet = await storage.local.get(category);
    const currentFieldFeatures = storageGet[category] || [];
    currentFieldFeatures.push(feature);
    await storage.local.set({ [category]: currentFieldFeatures});
    return Promise.resolve(true);
  } catch (e) {
    return Promise.reject(false);
  }
};

export const getFeatures = async (category: FeatureCategory): Promise<Array<GeneralFeature>> => {
  try {
    const storageGet = await storage.local.get(category);
    return storageGet[category] || [];
  } catch (e) {
    return [];
  }
};
