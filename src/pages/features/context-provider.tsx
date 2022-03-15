import React, { createContext, useReducer, Dispatch } from "react";
import { FeatureCategory, ModelConfig } from "../../constants";
import { Actions, ActionType } from './constants';

export const initContextState: AppContextType = {
  featureTableType: FeatureCategory.Page,
  clickButton: 'info',
  modelConfigs: [
    {
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
    }
  ],
  modelIdx: 0
};

export interface AppContextType {
  featureTableType: FeatureCategory;
  clickButton: string;
  modelConfigs: ModelConfig[];
  modelIdx: number;
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
  