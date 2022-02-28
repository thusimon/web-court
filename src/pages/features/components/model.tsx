import React, { useContext, useEffect, useRef } from 'react';
import { Actions } from '../constants';
import { AppContext } from '../context-provider';

import './model.scss';

const Model = () => {
  const { state, dispatch } = useContext(AppContext);
  const modelRef = useRef(null);

  useEffect(() => {
    (async () => {
      if (state.clickButton === 'models') {
        toggleModel(true);
      }
    })();
  }, [state])
  
  const toggleModel = (show: boolean) => {
    if (modelRef.current) {
      if (show) {
        modelRef.current.classList.remove('model-hide');
        modelRef.current.classList.add('model-show');
      } else {
        modelRef.current.classList.remove('model-show');
        modelRef.current.classList.add('model-hide');
      }
    }
  }
  const resetButton = () => dispatch({
    type: Actions.ButtonClick,
    data: '',
  });

  const buttonClickHandler = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const buttonName = evt.currentTarget.name;
    switch (buttonName) {
      case 'cancel': {
        toggleModel(false);
        resetButton();
        break;
      }
    }
  }
  return (<div id='model-container' className='model-hide' ref={modelRef}>
    <div id='model-main'>
      <div id='model-names-container'>
        <div id='model-names'>
          model names
        </div>
        <div id='model-names-buttons'>
          <button className='model-button'>+</button>
          <button className='model-button'>-</button>
        </div>
      </div>
      <div id='model-details'>
        <div id='model-layers'>
          model layers
        </div>
        <div id='model-layers-buttons'>
          <button className='model-button'>+</button>
          <button className='model-button'>-</button>
        </div>
      </div>
      <div id='controls'>
        <button name='save' onClick={buttonClickHandler}>Save</button>
        <button name='cancel' onClick={buttonClickHandler}>Cancel</button>
      </div>
    </div>
  </div>);
};

export default Model;
