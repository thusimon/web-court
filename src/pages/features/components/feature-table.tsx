import React from 'react';

const FeatureTable = ({ features } : { features: Array<Object> }) => {
  return (<table className='feature-table'>
    <thead>
      <tr>
        { 
          features && features.length > 0 ?
          Object.keys(features[0]).map(key => <th key={key}>{key}</th>) :
          <th></th>
        }
      </tr>
    </thead>
    <tbody>
    {
      features && features.length > 0 ?
      features.map((f, fidx) => <tr key={`${fidx}`}>{ Object.values(f).map((fv, fvidx) => <td key={`${fidx}-${fvidx}`}>{`${fv}`}</td>) }</tr>) :
      <tr></tr>
    }
    </tbody>
  </table>);
};

export default FeatureTable;

// const container = document.createElement('div');
// container.id = 'container';

// const headers = document.createElement('div');
// headers.id = 'headers'

// const features = document.createElement('div');
// features.id = 'features';

// const featurePageTable = document.createElement('table');
// featurePageTable.id = 'page-feature-table';
// featurePageTable.classList.add('feature-table');

// const featureFieldTable = document.createElement('table');
// featureFieldTable.id = 'field-feature-table';
// featureFieldTable.classList.add('feature-table');

// const pageFeatures = await getPageFeatures();
// const fieldFeatures = await getFieldFeatures();

// buildFeatures(featurePageTable, pageFeatures);
// buildFeatures(featureFieldTable, fieldFeatures);

// features.append(featurePageTable, featureFieldTable);

// container.append(headers, features);

// document.body.append(container);