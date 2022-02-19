import React from 'react';
import { FeatureCategory } from '../../../constants';
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

const Console: React.FC<ConsolePropsType> = ({ button, features, featureTableType }) => {
  let message = '';
  switch (button) {
    case 'info': {
      message = getFeatureBasicInfo(features, featureTableType);
    }
  }
  return (<textarea id='console-text-area' value={message} readOnly></textarea>)
};

export default Console;
