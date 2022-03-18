import React, { useContext, useEffect, useState, useRef } from 'react';
import { FeatureCategory } from '../../../constants';
import { trainModel } from '../ai/model';
import { getFeatureDataByCategory } from '../ai/utils/data';
import { Actions, FeaturesType } from '../constants';
import { AppContext } from '../context-provider';
import { getAllFeatures } from '../../../content/utils/storage';

import './console.scss';

export interface ConsolePropsType {
  button: string;
  features: FeaturesType;
  featureTableType: FeatureCategory;
}

export const getFeatureBasicInfo = (features: FeaturesType, featureTableType: FeatureCategory): string => {
  const featureTable = features[featureTableType]
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
  return `Features of ${featureTableType}:
  total: ${labels.length}
  labels:
${labelCountInfo}
`;
}

const Console: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const [training, setTraining] = useState(false);
  const [message, setMessage] = useState('');
  const consoleRef = useRef<HTMLTextAreaElement>(null);


  const [ allFeature, setAllFeatures ] = useState<FeaturesType>({
    Page: [],
    Inputs: [],
    Buttons: []
  });

  const refresh = async () => {
    const features = await getAllFeatures();
    const message = getFeatureBasicInfo(features, state.featureTableType);
    setAllFeatures(features);
    setMessage(message);
  };

  const dispatchButton = (button: string) => {
    dispatch({
      type: Actions.ButtonClick,
      data: button,
    });
  };

  useEffect(() => {
    refresh();
  }, []);
  useEffect(() => {
    (async () => {
      const { clickButton, featureTableType, modelConfigIdx, modelConfigs, iterParams } = state;
      switch (clickButton) {
        case 'refresh': {
          refresh();
          dispatchButton('');
          return;
        }
        case 'info': {
          const message = getFeatureBasicInfo(allFeature, featureTableType);
          setMessage(message);
          break;
        }
        case 'train': {
          if (training || consoleRef.current == null) {
            dispatchButton('');
            return;
          }
          const featureData = getFeatureDataByCategory(allFeature[featureTableType], featureTableType);
          const modelConfig = modelConfigs[modelConfigIdx];
          const consoleE = consoleRef.current;
          let message = `Training model for ${featureTableType} features, with model "${modelConfig.name}", Epoch=${iterParams.epochs} and learningRate=${iterParams.learningRate}...\n`
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
          return;
        }
        default:
          break;
      }
    })();
  }, [state]);

  return (<textarea id='console-text-area' value={message} readOnly ref={consoleRef}></textarea>)
};

export default Console;
