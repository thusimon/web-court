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
    });
  }
  const onClickHander = (evt: React.MouseEvent<HTMLButtonElement>) => {
    const name = evt.currentTarget.name;
    dispatch({
      type: Actions.ButtonClick,
      data: name,
    });
  }

  return (
    <header>
      <div className='controls'>
        <label htmlFor='feature-select'>Feature Category</label>
        <select value={state.featureTableType} onChange={onChangeHandler} id='feature-select'>
          {Object.values(FeatureCategory).map(fname => <option key={fname} value={fname}>{fname}</option>)}
        </select>
      </div>
      |
      <div className='controls'>
        <button title='Delete' name='delete' onClick={onClickHander}>🗑</button>
      </div>
      |
      <div className='controls'>
        <button title='Information' name='info' onClick={onClickHander}>🛈</button>
      </div>
      |
      <div className='controls'>
        <button title='Train' name='train' onClick={onClickHander}>🚅</button>
      </div>
      |
      <div className='controls'>
        <button title='Import' name='import' onClick={onClickHander}>📂</button>
      </div>
      |
      <div className='controls'>
        <button title='Export' name='export' onClick={onClickHander}>📁</button>
      </div>
      |
      <div className='controls'>
        <button title='Models' name='models' onClick={onClickHander}>🤖</button>
      </div>
    </header>
  );
};

export default Nav;
