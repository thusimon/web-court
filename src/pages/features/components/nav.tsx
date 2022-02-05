import React, { useContext } from 'react'
import { AppContext } from '../context-provider';
import { FeatureCategory } from '../../../constants';
import { Actions } from '../constants';

const Nav = () => {
  const { state, dispatch } = useContext(AppContext);

  const onChangeHandler = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: Actions.UpdateFeatureTable,
      data: evt.target.value as FeatureCategory,
    })
  }
  return (
    <header>
      <select value={state.featureTableType} onChange={onChangeHandler}>
        {Object.values(FeatureCategory).map(fname => <option key={fname} value={fname}>{fname}</option>)}
      </select>
    </header>
  );
};

export default Nav;
