import React, { useContext, useEffect, useRef, useState } from 'react';
import { Actions } from '../constants';
import { AppContext } from '../context-provider';
import { ModelConfig } from '../../../constants';

import './model.scss';

const Model = () => {
  const { state, dispatch } = useContext(AppContext);
  const modelRef = useRef(null);
  const [modelIndex, setModelIndex] = useState(-1);
  const [modelConfigStates, setModelConfigStates] = useState([])

  useEffect(() => {
    (async () => {
      if (state.clickButton === 'models') {
        toggleModel(true);
      }
    })();
    setModelConfigStates(state.modelConfigs)
  }, [state]);
  
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
  };

  const resetButton = () => dispatch({
    type: Actions.ButtonClick,
    data: '',
  });

  const updateConfigs = (configs: ModelConfig[]) => {
    dispatch({
      type: Actions.UpdateModelConfigs,
      data: configs
    })
  }

  const buttonClickHandler = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const buttonName = evt.currentTarget.name;
    switch (buttonName) {
      case 'cancel': {
        toggleModel(false);
        resetButton();
        break;
      }
    }
  };

  const nameInputClickHandler = (evt: React.MouseEvent<HTMLInputElement, MouseEvent>, idx: number) => {
    const detail = evt.detail;
    const input = evt.currentTarget;
    if (detail === 2) {
      // not double click
      input.disabled = false;
    } else if (detail === 1) {
      setModelIndex(idx);
    }
  };

  const nameInputBlurHandler = (evt: React.FocusEvent<HTMLInputElement, Element>, idx: number) => {
    const input = evt.currentTarget;
    input.disabled = true;
  };

  const nameInputChangeHandler = (evt: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const value = evt.currentTarget.value;
    if (value) {
      modelConfigStates[idx].name = value;
      setModelConfigStates([...modelConfigStates]);
    }
  }

  const modelHandler = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const name = evt.currentTarget.name;
    switch (name) {
      case 'model-add': {
        const newConfig: ModelConfig = {
          name: 'new-config',
          config: []
        }
        setModelConfigStates([...modelConfigStates, newConfig]);
        break;
      }
      case 'model-delete': {
        if (modelIndex > -1) {
          const updatedConfigs = modelConfigStates.slice();
          updatedConfigs.splice(modelIndex, 1);
          setModelConfigStates(updatedConfigs);
          setModelIndex(-1);
        }
        break;
      }
      default:
        break;
    }
  };

  return (<div id='model-container' className='model-hide' ref={modelRef}>
    <div id='model-main'>
      <div id='model-names-container'>
        <label>Models</label>
        <div id='model-names'>
          {modelConfigStates.map((config, idx) => {
            const className = idx === modelIndex ? 'name-input model-selected' : 'name-input';
            return <input className={className}
              key={`${idx}-${config.name}`}
              value={config.name}
              onClick={(evt) => nameInputClickHandler(evt, idx)}
              onBlur={(evt) => nameInputBlurHandler(evt, idx)}
              onChange={(evt) => nameInputChangeHandler(evt, idx)}
              disabled={false}></input>;
          })}
        </div>
        <div id='model-names-buttons'>
          <button className='model-button' name='model-add' onClick={modelHandler}>+</button>
          <button className='model-button' name='model-delete' onClick={modelHandler}>-</button>
        </div>
      </div>
      <div id='model-layers-container'>
        <label>Layers</label>
        <div id='model-layers'>
          model layers
        </div>
        <div id='model-layers-buttons'>
          <button className='model-button'>+</button>
          <button className='model-button'>-</button>
        </div>
      </div>
      <div id='buttons-container'>
        <button name='save' onClick={buttonClickHandler}>Save</button>
        <button name='cancel' onClick={buttonClickHandler}>Cancel</button>
      </div>
    </div>
  </div>);
};

export default Model;
