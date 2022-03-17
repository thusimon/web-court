import React, { createContext, useReducer, Dispatch } from "react";
import { FeatureCategory, IterParam, ModelConfig } from "../../constants";
import { Actions, ActionType, DefaultIterParam, DefaultModelConfig } from './constants';

export const initContextState: AppContextType = {
  featureTableType: FeatureCategory.Page,
  clickButton: 'info',
  modelConfigs: [DefaultModelConfig],
  modelConfigIdx: 0,
  iterParam: DefaultIterParam
};

export interface AppContextType {
  featureTableType: FeatureCategory;
  clickButton: string;
  modelConfigs: ModelConfig[],
  modelConfigIdx: number;
  iterParam: IterParam;
}

export const AppContext = createContext<{
  state: AppContextType;
  dispatch: Dispatch<ActionType>;
}>({
  state: initContextState,
  dispatch: () => null
});

export const reducer = (state: AppContextType, action: ActionType) => {
  switch (action.type) {
    case Actions.UpdateFeatureTable: {
      const newTableType = action.data as FeatureCategory
      return {
        ...state,
        ...{
          featureTableType: newTableType
        }
      };
    }
    case Actions.ButtonClick: {
      const clickButton = action.data as string;
      return {
        ...state,
        ...{
          clickButton
        }
      };
    }
    case Actions.UpdateModelConfigIdx: {
      const modelConfigIdx = action.data as number;
      return {
        ...state,
        ...{
          modelConfigIdx
        }
      };
    }
    case Actions.UpdateModelConfigs: {
      const modelConfigs = action.data as ModelConfig[];
      return {
        ...state,
        ...{
          modelConfigs
        }
      };
    }
    default:
      return state;
  }
};

export const ContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initContextState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      { children }
    </AppContext.Provider>
  );
};
  