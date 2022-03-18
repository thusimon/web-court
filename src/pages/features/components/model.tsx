import React, { useContext, useEffect, useRef, useState } from 'react';
import { ActivationIdentifier } from '@tensorflow/tfjs-layers/dist/keras_format/activation_config';
import { Actions, DefaultIterParam, DefaultModelConfig } from '../constants';
import { AppContext } from '../context-provider';
import { IterParam, ModelConfig, ModelLayer } from '../../../constants';
import { getAllModelConfig, getIterParams, saveAllModelConfig, saveIterParams } from '../../../content/utils/storage';

import './model.scss';

const Model = () => {
  const { state, dispatch } = useContext(AppContext);
  const modelRef = useRef(null);
  const [modelIndex, setModelIndex] = useState(0);
  const [modelConfigStates, setModelConfigStates] = useState<ModelConfig[]>([]);
  const [iterParams, setIterParams] = useState<IterParam>(DefaultIterParam);

  useEffect(() => {
    (async () => {
      const [modelConfigs, iterParams] = await Promise.all([getAllModelConfig(), getIterParams()]);
      setModelIndex(0);
      setModelConfigStates(modelConfigs);
      setIterParams(iterParams);
      updateConfigs(modelConfigs);
      updateIterParams(iterParams);
    })();
  }, []);

  useEffect(() => {
    if (state.clickButton === 'models') {
      toggleModel(true);
    }
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

  const updateConfigIndex = (configIndex: number) => {
    dispatch({
      type: Actions.UpdateModelConfigIdx,
      data: configIndex
    });
  };

  const updateConfigs = (configs: ModelConfig[]) => {
    dispatch({
      type: Actions.UpdateModelConfigs,
      data: configs
    });
  };

  const updateIterParams = (iterParams: IterParam) => {
    dispatch({
      type: Actions.UpdateIterParams,
      data: iterParams
    });
  }

  const buttonClickHandler = async (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const buttonName = evt.currentTarget.name;
    switch (buttonName) {
      case 'cancel': {
        toggleModel(false);
        resetButton();
        break;
      }
      case 'save': {
        toggleModel(false);
        resetButton();
        updateConfigIndex(modelIndex);
        updateConfigs(modelConfigStates);
        updateIterParams(iterParams);
        await Promise.all([saveAllModelConfig(modelConfigStates), saveIterParams(iterParams)]);
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
      updateConfigIndex(idx);
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
  };

  const layerChangeHandler = (evt: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>, idx: number) => {
    const value = evt.currentTarget.value;
    const name = evt.currentTarget.name;
    const currentModel = modelConfigStates[modelIndex];
    if (!currentModel) {
      return;
    }
    const currentModalLayer = currentModel.config[idx];
    if (!currentModalLayer) {
      return;
    }
    switch (name) {
      case 'layer-unit': {
        currentModalLayer.units = parseInt(value);
        break;
      }
      case 'layer-activation': {
        currentModalLayer.activation = value as ActivationIdentifier;
        break;
      }
      default:
        break;
    }
    setModelConfigStates([...modelConfigStates]);
  }

  const modelHandler = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const name = evt.currentTarget.name;
    switch (name) {
      case 'model-add': {
        const newConfig: ModelConfig = {
          name: 'new-config',
          config: [
            {
              units: 20,
              activation: 'relu'
            },
            {
              units: 2,
              activation: 'sigmoid'
            }
          ]
        }

        const configs = [...modelConfigStates, newConfig];
        setModelConfigStates(configs);
        setModelIndex(configs.length - 1);
        break;
      }
      case 'model-delete': {
        if (modelConfigStates.length <= 1) {
          return;
        }
        if (modelIndex > -1) {
          const updatedConfigs = modelConfigStates.slice();
          updatedConfigs.splice(modelIndex, 1);
          setModelConfigStates(updatedConfigs);
          setModelIndex(-1);
        }
        break;
      }
      case 'layer-add': {
        const currentModel = modelConfigStates[modelIndex];
        if (!currentModel) {
          return;
        }
        const newLayer: ModelLayer = {
          units: 20,
          activation: 'sigmoid'
        };
        currentModel.config.push(newLayer);
        setModelConfigStates([...modelConfigStates]);
        break;
      }
      case 'layer-delete': {
        const currentModel = modelConfigStates[modelIndex];
        if (!currentModel || currentModel.config.length <= 2) {
          return;
        }
        currentModel.config.splice(-1, 1);
        setModelConfigStates([...modelConfigStates]);
        break;
      }
      default:
        break;
    }
  };

  const iterParamsHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(evt.currentTarget.value);
    const name = evt.currentTarget.name;
    const currentIterParams = state.iterParams;
    switch (name) {
      case 'epochs': {
        currentIterParams.epochs = value;
        break;
      }
      case 'learning-rate': {
        currentIterParams.learningRate = value;
        break;
      }
      default:
        break;
    }
    setIterParams({...currentIterParams});
    updateIterParams(currentIterParams);
  };

  const modelLayersConfigs = modelConfigStates[modelIndex] ? modelConfigStates[modelIndex].config : [];
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
          <button className='model-button' name='model-delete' onClick={modelHandler} disabled={modelConfigStates.length<=1}>-</button>
        </div>
      </div>
      <div id='model-layers-container'>
        <label>Layers</label>
        <div id='model-layers'>
          {modelLayersConfigs.map((config, idx) => {
            const units = config.units;
            const activation = config.activation;
            return <div className='layer-config' key={`layer-${idx}`}>
              <span>Node:</span>
              <input type='number' name='layer-unit' min={1} max={10000} step={1} value={units} onChange={(evt) => layerChangeHandler(evt, idx)}/>
              <span>Activation:</span>
              <select name='layer-activation' value={activation} onChange={(evt) => layerChangeHandler(evt, idx)}>
                <option value='elu'>elu</option>
                <option value='hardSigmoid'>hardSigmoid</option>
                <option value='linear'>linear</option>
                <option value='relu'>relu</option>
                <option value='relu6'>relu6</option>
                <option value='selu'>selu</option>
                <option value='sigmoid'>sigmoid</option>
                <option value='softmax'>softmax</option>
                <option value='softplus'>softplus</option>
                <option value='softsign'>softsign</option>
                <option value='tanh'>tanh</option>
                <option value='swish'>swish</option>
                <option value='mish'>mish</option>
              </select>
            </div>
          })}
        </div>
        <div id='model-layers-buttons'>
          <button className='model-button' name='layer-add' onClick={modelHandler}>+</button>
          <button className='model-button' name='layer-delete' onClick={modelHandler} disabled={modelLayersConfigs.length<=2}>-</button>
        </div>
      </div>
      <div id='model-iters-container'>
        <label>Iteration Parameters</label>
        <div id='model-iters'>
          <label htmlFor='iter-epochs'>Epochs:</label><br></br>
          <input id='iter-epochs' name='epochs' type='number' value={iterParams.epochs} onChange={iterParamsHandler}></input>
          <label htmlFor='iter-learningRate'>Learning Rate:</label><br></br>
          <input type='number' name='learning-rate' value={iterParams.learningRate} step={0.001} onChange={iterParamsHandler}></input>
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
