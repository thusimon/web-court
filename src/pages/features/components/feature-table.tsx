import React, { useState, useContext } from 'react';
import { AppContext } from '../context-provider';
import { FeatureCategory } from '../../../constants';
import { constructPageFeatureOrdered } from '../../../content/feature';
import { GeneralFeatureLabeled } from '../../../content/utils/storage';
import { Actions } from '../constants';

import './feature-table.scss';

export interface FeatureTablePropsType {
  features: {
    page: GeneralFeatureLabeled[];
    field: GeneralFeatureLabeled[];
  }
  featureTableType: FeatureCategory;
}

const FeatureTable = ({ features, featureTableType } : FeatureTablePropsType) => {
  const selectedTable = featureTableType === FeatureCategory.Page ? features.page : features.field;
  const [selectedFeatureIdx, setSelectedFeatureIdx] = useState(-1);
  const { dispatch } = useContext(AppContext);

  const onClickFeature = (evt: React.MouseEvent<HTMLTableRowElement>, idx: number) => {
    dispatch({
      type: Actions.SelectFeature,
      data: idx
    });
    setSelectedFeatureIdx(idx);
  }

  return (
    selectedTable && selectedTable.length == 0 ?
    <div>No feature collected</div> :
    <table className='feature-table'>
      <thead>
        <tr>
          { constructPageFeatureOrdered(selectedTable[0]).key.map(key => <th key={key}>{key}</th>) }
        </tr>
      </thead>
      <tbody>
      {
        selectedTable.map((feature, fidx) => <tr key={`${fidx}`}
          onClick={(evt) => onClickFeature(evt, fidx)}
          className={fidx === selectedFeatureIdx ? 'selected' : 'non-selected'}>{
          constructPageFeatureOrdered(feature).value.map((fv, fvidx) => <td key={`${fidx}-${fvidx}`} title={`${fv}`}>{`${fv}`}</td>)
        }</tr>)
      }
      </tbody>
   </table>
  );
};

export default FeatureTable;
