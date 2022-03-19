import React, { useContext, useEffect, useState, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { FeatureCategory } from '../../../constants';
import { trainModel } from '../ai/model';
import { getFeatureDataByCategory } from '../ai/utils/data';
import { Actions, FeaturesType } from '../constants';
import { AppContext } from '../context-provider';
import { getAllFeatures, saveModelToIndexDB } from '../../../common/storage';
import * as browser from 'webextension-polyfill';

import './console.scss';

export interface ConsolePropsType {
  button: string;
  features: FeaturesType;
  featureCategory: FeatureCategory;
}

export const getFeatureBasicInfo = (features: FeaturesType, featureCategory: FeatureCategory): string => {
  const featureTable = features[featureCategory]
  if (!(featureTable instanceof Array)) {
    return '';
  }
  const labels = featureTable.map(f => f.label);
  const uniqueLabels = [...new Set(labels)];
  let labelCountInfo = ''
  uniqueLabels.forEach(uniqueLabel => {
    const labelCount = labels.filter(label => label === uniqueLabel);
    labelCountInfo += `    ${uniqueLabel}: ${labelCount.length}
`;
  });
  return `Features of ${featureCategory}:
  total: ${labels.length}
  labels:
${labelCountInfo}
`;
}

const Console: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const [training, setTraining] = useState(false);
  const [message, setMessage] = useState('');
  const [model, setModel] = useState<tf.Sequential>(null);
  const consoleRef = useRef<HTMLTextAreaElement>(null);


  const [ allFeature, setAllFeatures ] = useState<FeaturesType>({
    Page: [],
    Inputs: [],
    Buttons: []
  });

  const refresh = async () => {
    const features = await getAllFeatures();
    const message = getFeatureBasicInfo(features, state.featureCategory);
    setAllFeatures(features);
    setMessage(message);
  };

  const dispatchButton = (button: string) => {
    dispatch({
      type: Actions.ButtonClick,
      data: button,
    });
  };

  const consoleButtonHandler = async (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const target = evt.currentTarget;
    const name = target.name;
    const { modelConfigIdx, modelConfigs } = state;
    const modelConfig = modelConfigs[modelConfigIdx];
    switch (name) {
      case 'save-model': {
        await saveModelToIndexDB(model, modelConfig.name);
        break;
      }
      default:
        break;
    }
  };

  useEffect(() => {
    refresh();
  }, []);
  useEffect(() => {
    (async () => {
      const { clickButton, featureCategory, modelConfigIdx, modelConfigs, iterParams } = state;
      switch (clickButton) {
        case 'refresh': {
          refresh();
          dispatchButton('');
          return;
        }
        case 'info': {
          const message = getFeatureBasicInfo(allFeature, featureCategory);
          setMessage(message);
          break;
        }
        case 'train': {
          if (training || consoleRef.current == null) {
            dispatchButton('');
            return;
          }
          const featureData = getFeatureDataByCategory(allFeature[featureCategory], featureCategory);
          const modelConfig = modelConfigs[modelConfigIdx];
          const consoleE = consoleRef.current;
          let message = `Training model for ${featureCategory} features, with model "${modelConfig.name}", Epoch=${iterParams.epochs} and learningRate=${iterParams.learningRate}...\n`
          setMessage(message);
          const model = await trainModel(featureData, modelConfig, (msg, trainLogs, complete) => {
            message += `  ${msg}\n`;
            setMessage(message);
            consoleE.scrollTop = consoleE.scrollHeight;
            if (complete) {
              setTraining(false);
            }
          }, iterParams);
          dispatchButton('');
          setModel(model);
          return;
        }
        default:
          break;
      }
    })();
  }, [state]);

  return (<div id='console-container'>
      <textarea id='console-text-area' value={message} readOnly ref={consoleRef}></textarea>
      <div id='console-buttons'>
        <button name='save-model' title='Save trained model' onClick={consoleButtonHandler}>Save Model</button>
      </div>
    </div>)
};

export default Console;
