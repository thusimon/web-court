import React, { useContext } from 'react'
import { AppContext } from '../context-provider';
import { FeatureCategory } from '../../../constants';
import { Actions } from '../constants';
import './nav.scss'

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
      <label htmlFor='feature-select'>Feature Category</label>
      <select value={state.featureTableType} onChange={onChangeHandler} id='feature-select'>
        {Object.values(FeatureCategory).map(fname => <option key={fname} value={fname}>{fname}</option>)}
      </select>
    </header>
  );
};

export default Nav;
