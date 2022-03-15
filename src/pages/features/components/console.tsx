import React, { useContext, useEffect, useState } from 'react';
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
    const { clickButton, featureTableType} = state;
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
        if (training) {
          dispatchButton('');
          return;
        }
        let message = `Training model for ${featureTableType} features...\n`
        setMessage(message);
        const featureData = getFeatureDataByCategory(allFeature[featureTableType], featureTableType);
        const modelConfigs = state.modelConfigs;
        const modelConfigIdx = state.modelIdx;
        const modelConfig = modelConfigs[modelConfigIdx];
        const model = trainModel(featureData, modelConfig, (msg, trainLogs, complete) => {
          message += `  ${msg}\n`;
          setMessage(message);
          if (complete) {
            setTraining(false);
          }
        });
        dispatchButton('');
        return;
      }
      default:
        break;
    }
  }, [state]);

  return (<textarea id='console-text-area' value={message} readOnly></textarea>)
};

export default Console;
