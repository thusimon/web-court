import { FeatureCategory } from "../../constants";

export enum Actions {
  UpdateFeatureTable,
  ButtonClick,
  SelectFeature,
  UpdateChanging
}

export interface ActionType {
  type: Actions;
  data: number | string | boolean;
}