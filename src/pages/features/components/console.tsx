import React, { useContext, useEffect, useState } from 'react';
import { FeatureCategory } from '../../../constants';
import { PageClass, trainModel } from '../ai/model';
import { getFeatureData } from '../ai/utils/data';
import { FeaturesType } from '../constants';
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
  const { state } = useContext(AppContext);
  let [training, setTraining] = useState(false);
  let [message, setMessage] = useState('');

  const [ allFeature, setAllFeatures ] = useState<FeaturesType>({
    Page: [],
    Inputs: [],
    Buttons: []
  });
  useEffect(() => {
    (async () => {
      const features = await getAllFeatures();
      const message = getFeatureBasicInfo(features, state.featureTableType);
      setAllFeatures(features);
      setMessage(message);
    })();
  }, []);
  useEffect(() => {
    const { clickButton, featureTableType} = state;
    if (clickButton === 'info') {
      const message = getFeatureBasicInfo(allFeature, featureTableType);
      setMessage(message);
    } else if (state.clickButton === 'train' && !training) {
      let message = `Training model for ${featureTableType} features...\n`
      setMessage(message);
      const featureData = getFeatureData(allFeature[featureTableType], PageClass, 0.1);
      const model = trainModel(featureData, (msg, trainLogs, complete) => {
        message += `  ${msg}\n`;
        setMessage(message);
        if (complete) {
          setTraining(false);
        }
      });
    }
  }, [state]);

  return (<textarea id='console-text-area' value={message} readOnly></textarea>)
};

export default Console;
