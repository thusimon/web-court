import * as tf from '@tensorflow/tfjs';
import { storage, downloads, Downloads } from 'webextension-polyfill';
import { GeneralFeature } from '../content/feature';
import { LabelData } from '../content/message';
import { FeatureCategory, FeaturesType, IterParam, ModelConfig, StorageCategory, StorageData } from '../constants';
import { DefaultIterParam, DefaultModelConfig } from '../pages/features/constants';
import { openDB } from 'idb';
import { extend } from 'lodash';

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

export const getAllLocalStorageFeatures = async (): Promise<FeaturesType> => {
  const featureStorage = await storage.local.get(StorageCategory.Features);
  const features = featureStorage[StorageCategory.Features] || {};
  return features;
}

export const getAllIndexedDBFeatures = async (): Promise<any> => {
  const imageFeature = await getImageLabelData();
  return {
    [FeatureCategory.Images]: imageFeature
  };
}

export const getAllFeatures = async (): Promise<FeaturesType> => {
  const [localStorageFeature, indexedDBFeature] = await Promise.all([
    getAllLocalStorageFeatures(),
    getAllIndexedDBFeatures()
  ]);
  const allFeatures = extend({}, localStorageFeature, indexedDBFeature) as FeaturesType;
  return allFeatures;
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

export const saveModelToIndexDB = async (model: tf.Sequential, modelName: string): Promise<tf.LayersModel> => {
  await model.save(`indexeddb://${modelName}`);
  return model;
};

export const loadModelInFromIndexDB = async (modelName: string): Promise<tf.LayersModel> => {
  const model = await tf.loadLayersModel(`indexeddb://${modelName}`);
  return model;
};


const WEBCOURT_DB_NAME = 'webcourt-db';
const WEBCOURT_DB_LABEL_IMAGE_STORE = `${WEBCOURT_DB_NAME}-label-image-store`;

export const openIndexedDB = async () => {
  return await openDB(WEBCOURT_DB_NAME, 2, {
    upgrade(db) {
      // Create a store of objects
      db.createObjectStore(WEBCOURT_DB_LABEL_IMAGE_STORE, {
        // The 'id' property of the object will be the key.
        keyPath: 'id',
        // If it isn't explicitly set, create a value by auto incrementing.
        autoIncrement: true,
      });
    },
  });
};

export const saveImageLabelData = async (url:string, imgUri: string, label: number[]) => {
  try {
    const db = await openIndexedDB();
    const result = await db.add(WEBCOURT_DB_LABEL_IMAGE_STORE, {
      url,
      date: new Date(),
      imgUri,
      label
    });
    console.log(result);
  } catch (e) {
    console.log(e);
  }
}

export const getImageLabelData = async () => {
  try {
    const db = await openIndexedDB();
    return await db.getAll(WEBCOURT_DB_LABEL_IMAGE_STORE);
  } catch (e) {
    console.log(e);
  }
}

export const deleteImageLabelData = async (id: number) => {
  try {
    const db = await openIndexedDB();
    return await db.delete(WEBCOURT_DB_LABEL_IMAGE_STORE, id);
  } catch (e) {
    console.log(e);
  }
}

export const getAllImageLabelKeys = async () => {
  try {
    const db = await openIndexedDB();
    return await db.getAllKeys(WEBCOURT_DB_LABEL_IMAGE_STORE);
  } catch (e) {
    console.log(e);
  }
}
export const downloadData = async (downloadOption: Downloads.DownloadOptionsType) => {
  return downloads.download(downloadOption);
};
