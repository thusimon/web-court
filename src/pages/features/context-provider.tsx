import React, { createContext, useReducer, Dispatch } from "react";
import { FeatureCategory, IterParam, ModelConfig } from "../../constants";
import { Actions, ActionType, DefaultIterParam, DefaultModelConfig } from './constants';

export const initContextState: AppContextType = {
  featureCategory: FeatureCategory.Page,
  clickButton: 'info',
  searchProp: null,
  searchVal: null,
  modelConfigs: [DefaultModelConfig],
  modelConfigIdx: 0,
  iterParams: DefaultIterParam
};

export interface AppContextType {
  featureCategory: FeatureCategory;
  clickButton: string;
  searchProp: string;
  searchVal: string;
  modelConfigs: ModelConfig[],
  modelConfigIdx: number;
  iterParams: IterParam;
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
          featureCategory: newTableType
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
    case Actions.UpdateIterParams: {
      const iterParams = action.data as IterParam;
      return {
        ...state,
        ...{
          iterParams
        }
      };
    }
    case Actions.UpdateSearch: {
      const search = action.data as object;
      return {
        ...state,
        ...search
      };
    }
    default:
      return state;
  }
};

export const ContextProvider: React.FC<React.PropsWithChildren<any>> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initContextState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      { children }
    </AppContext.Provider>
  );
};
  