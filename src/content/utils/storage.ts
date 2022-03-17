import { storage } from 'webextension-polyfill';
import { GeneralFeature } from '../feature';
import { LabelData } from '../message';
import { FeatureCategory, FeaturesType, IterParam, ModelConfig, StorageCategory, StorageData } from '../../constants';
import { DefaultIterParam, DefaultModelConfig } from '../../pages/features/constants';

export type GeneralFeatureLabeled = GeneralFeature & LabelData;

export const addFeature = async (category: FeatureCategory, feature: GeneralFeature) => {
  try {
    const featureStorage = await storage.local.get(StorageCategory.Features);
    const features = featureStorage[StorageCategory.Features] || {};
    const currentFieldFeatures = features[category] || [];
    currentFieldFeatures.push(feature);
    features[category] = currentFieldFeatures;
    await storage.local.set({ [StorageCategory.Features]: features});
    return Promise.resolve(true);
  } catch (e) {
    return Promise.reject(false);
  }
};

export const addFeatureBulk = async (category: FeatureCategory, newFeatures: GeneralFeature[]) => {
  try {
    const featureStorage = await storage.local.get(StorageCategory.Features);
    const features = featureStorage[StorageCategory.Features] || {};
    let currentFieldFeatures: GeneralFeature[] = features[category] || [];
    currentFieldFeatures = currentFieldFeatures.concat(newFeatures);
    features[category] = currentFieldFeatures;
    await storage.local.set({ [StorageCategory.Features]: features});
    return Promise.resolve(true);
  } catch (e) {
    return Promise.reject(false);
  }
};

export const getFeatures = async (category: FeatureCategory): Promise<Array<GeneralFeature>> => {
  try {
    const featureStorage = await storage.local.get(StorageCategory.Features);
    const features = featureStorage[StorageCategory.Features] || {};
    return features[category] || [];
  } catch (e) {
    return [];
  }
};

export const getAllFeatures = async (): Promise<FeaturesType> => {
  const featureStorage = await storage.local.get(StorageCategory.Features);
  const features = featureStorage[StorageCategory.Features] || {};
  return features;
};

export const setFeatures = async (category: FeatureCategory, newFeatures: Array<GeneralFeature>): Promise<Array<GeneralFeature>> => {
  try {
    const featureStorage = await storage.local.get(StorageCategory.Features);
    const features = featureStorage[StorageCategory.Features] || {};
    features[category] = newFeatures;
    await storage.local.set({[StorageCategory.Features]: features});
    return newFeatures
  } catch (e) {
    return newFeatures;
  }
};

export const deleteFeature = async (category: FeatureCategory, idx: number): Promise<Array<GeneralFeature>> => {
  const featureStorage = await storage.local.get(StorageCategory.Features);
  const features = featureStorage[StorageCategory.Features] || {};
  const categoryFeature = features[category] || [];
  categoryFeature.splice(idx, 1);
  features[category] = categoryFeature;
  const updated = await setFeatures(category, categoryFeature);
  return updated;
};

export const deleteFeatureCategory = async (category: FeatureCategory): Promise<[]> => {
  await setFeatures(category, []);
  return [];
};

export const getAllModelConfig = async (): Promise<ModelConfig[]> => {
  const modelConfigStorage = await storage.local.get(StorageCategory.ModelConfigs);
  const modelConfigs = modelConfigStorage[StorageCategory.ModelConfigs] || [DefaultModelConfig];
  return modelConfigs;
};

export const saveAllModelConfig = async (modelConfigs: ModelConfig[]) => {
  await storage.local.set({ [StorageCategory.ModelConfigs]: modelConfigs });
  return modelConfigs;
};

export const getIterParams = async (): Promise<IterParam> => {
  const iterParamStorage = await storage.local.get(StorageCategory.IterParams);
  const iterParams = iterParamStorage[StorageCategory.IterParams] || DefaultIterParam;
  return iterParams;
};

export const saveIterParams = async (iterParams: IterParam) => {
  await storage.local.set({ [StorageCategory.IterParams]: iterParams });
  return iterParams;
};

export const saveAllData = async (data: StorageData): Promise<StorageData> => {
  await storage.local.set(data);
  return data;
};

export const getAllData = async (): Promise<StorageData> => {
  const data = await storage.local.get(null);
  return data;
};

export const clearAllData = async () => {
  await storage.local.clear();
  return {};
};
