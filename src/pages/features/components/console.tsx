import React, { useState } from 'react';
import { FeatureCategory } from '../../../constants';
import { PageClass, trainModel } from '../ai/model';
import { getFeatureData } from '../ai/utils/data';
import { FeaturesType } from '../constants';

import './console.scss';

export interface ConsolePropsType {
  button: string;
  features: FeaturesType;
  featureTableType: FeatureCategory;
}

export const getFeatureBasicInfo = (features: FeaturesType, featureTableType: FeatureCategory): string => {
  const featureTable = features[featureTableType]
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

const useForceUpdate = () => {
  const [now, setNow] = useState(Date.now());
  return () => {
    const curr = Date.now();
    if (curr > now + 200) {
      setNow(curr);
    }
  }
};

const Console: React.FC<ConsolePropsType> = ({ button, features, featureTableType }) => {
  let [training, setTraining] = useState(false);
  let [message, setMessage] = useState('');
 
  const forceUpdate = useForceUpdate();
  switch (button) {
    case 'info': {
      message = getFeatureBasicInfo(features, featureTableType);
      break;
    }
    case 'train': {
      if (training) {
        console.log('still training');
        return;
      }
      training = true;
      let message = `Training model for ${featureTableType} features...\n`
      const featureData = getFeatureData(features[featureTableType], PageClass, 0.1);
      const model = trainModel(featureData, (msg, trainLogs) => {
        message += `  ${msg}\n`;
        console.log(msg);
        console.log(trainLogs);
      });
      console.log(message, featureData);
      break;
    }
    default:
      break;
  }
  return (<textarea id='console-text-area' value={message} readOnly></textarea>)
};

export default Console;
