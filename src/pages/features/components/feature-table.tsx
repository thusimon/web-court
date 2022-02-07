import React from 'react';
import { constructPageFeatureOrdered } from '../../../content/feature';
import { GeneralFeatureLabeled } from '../../../content/utils/storage';
import './feature-table.scss';

const FeatureTable = ({ features } : { features: GeneralFeatureLabeled[] }) => {
  return (<table className='feature-table'>
    <thead>
      <tr>
        { 
          features && features.length > 0 ?
          constructPageFeatureOrdered(features[0]).key.map(key => <th key={key}>{key}</th>) :
          <th></th>
        }
      </tr>
    </thead>
    <tbody>
    {
      features && features.length > 0 ?
      features.map((feature, fidx) => <tr key={`${fidx}`}>{ constructPageFeatureOrdered(feature).value.map((fv, fvidx) => <td key={`${fidx}-${fvidx}`} title={`${fv}`}>{`${fv}`}</td>) }</tr>) :
      <tr></tr>
    }
    </tbody>
  </table>);
};

export default FeatureTable;
