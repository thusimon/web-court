import React, { createContext, useReducer, Dispatch } from "react";
import { FeatureCategory } from "../../constants";
import { Actions, ActionType } from './constants';

export const initContextState = {
  featureTableType: FeatureCategory.Page,
  clickButton: '',
  selectFeatureIdx: -1,
  changing: false
};

export interface AppContextType {
  featureTableType: FeatureCategory;
  clickButton: string;
  selectFeatureIdx: number;
  changing: boolean;
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
      state.clickButton = action.data as string;
      return {
        ...state,
        ...{
          changing: true
        }
      };
    }
    case Actions.SelectFeature: {
      state.selectFeatureIdx = action.data as number;
      return state;
    }
    case Actions.UpdateChanging: {
      return {
        ...state,
        ...{
          changing: false,
          selectFeatureIdx: -1
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
  