import { FeatureCategory } from "../../constants";

export enum Actions {
  UpdateFeatureTable
}

export interface ActionType {
  type: Actions;
  data: FeatureCategory;
}