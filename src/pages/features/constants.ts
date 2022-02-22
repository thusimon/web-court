import { GeneralFeatureLabeled } from "@src/content/utils/storage";
import { FeatureCategory } from "@srcconstants";

export enum Actions {
  UpdateFeatureTable,
  ButtonClick
}

export interface ActionType {
  type: Actions;
  data: number | string | boolean;
}

export type FeaturesType = {
  [key in FeatureCategory]: GeneralFeatureLabeled[];
}
