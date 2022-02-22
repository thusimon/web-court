import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context-provider';
import { FeatureCategory } from '../../../constants';
import { constructPageFeatureOrdered } from '../../../content/feature';
import { FeaturesType } from '../constants';
import { deleteFeature, getAllFeatures } from '../../../content/utils/storage';

import './feature-table.scss';

export interface FeatureTablePropsType {
  features: FeaturesType;
  featureTableType: FeatureCategory;
  selectFeatureIdx: number;
}

const FeatureTable = () => {
  const { state } = useContext(AppContext);
  const [ selectedFeatureIdx, setSelectedFeatureIdx ] = useState(-1);
  const [ allFeature, setAllFeatures ] = useState<FeaturesType>({
    Page: [],
    Field: []
  });
  useEffect(() => {
    (async () => {
      const allFeatures = await getAllFeatures();
      setAllFeatures(allFeatures);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      if (state.clickButton === 'delete' && selectedFeatureIdx > -1) {
        //TODO add confirm dialog
        await deleteFeature(featureTableType, selectedFeatureIdx);
        const allFeatures = await getAllFeatures()
        setAllFeatures(allFeatures);
        setSelectedFeatureIdx(-1);
      }
    })();
  }, [state])
  
  const { featureTableType } = state;
  const selectedTable = allFeature[featureTableType];

  const onClickFeature = (evt: React.MouseEvent<HTMLTableRowElement>, idx: number) => {
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
