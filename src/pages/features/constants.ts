import { GeneralFeatureLabeled } from "../../content/utils/storage";
import { FeatureCategory, ModelConfig } from "../../constants";

export enum Actions {
  UpdateFeatureTable,
  ButtonClick,
  UpdateModelConfigs
}

export interface ActionType {
  type: Actions;
  data: number | string | boolean | ModelConfig[];
}

export type FeaturesType = {
  [key in FeatureCategory]: GeneralFeatureLabeled[];
}
