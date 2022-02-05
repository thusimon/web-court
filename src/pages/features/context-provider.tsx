import React, { createContext, useReducer, Dispatch } from "react";
import { FeatureCategory } from "../../constants";
import { Actions, ActionType } from './constants';

export const initContextState = {
  featureTableType: FeatureCategory.Page
};

export interface AppContextType {
  featureTableType: FeatureCategory
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
  