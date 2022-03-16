import { GeneralFeatureLabeled } from "../../content/utils/storage";
import { FeatureCategory, ModelConfig } from "../../constants";

export enum Actions {
  UpdateFeatureTable,
  ButtonClick,
  UpdateModelConfigs,
  UpdateModelConfigIdx
}

export interface ActionType {
  type: Actions;
  data: number | string | boolean | ModelConfig[];
}

export type FeaturesType = {
  [key in FeatureCategory]: GeneralFeatureLabeled[];
}

export const DefaultModelConfig: ModelConfig = {
  name: 'default',
  config: [
    {
      units: 32,
      activation: 'relu'
    },
    {
      units: 16,
      activation: 'relu'
    },
    {
      units: 2,
      activation: 'sigmoid'
    }
  ]
};
