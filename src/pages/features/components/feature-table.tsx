import React, { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '../context-provider';
import { Actions } from '../constants';
import { FeatureCategory, FeaturesType } from '../../../constants';
import { constructPageFeatureOrdered } from '../../../content/feature';
import { deleteFeature, getAllFeatures, saveAllFeature } from '../../../content/utils/storage';

import './feature-table.scss';

export interface FeatureTablePropsType {
  features: FeaturesType;
  featureTableType: FeatureCategory;
  selectFeatureIdx: number;
}

const FeatureTable = () => {
  const { state, dispatch } = useContext(AppContext);
  const [ selectedFeatureIdx, setSelectedFeatureIdx ] = useState(-1);
  const fileInput = useRef(null);
  const [ allFeature, setAllFeatures ] = useState<FeaturesType>({
    Page: [],
    Field: [],
    Submit: []
  });

  const resetButton = () => dispatch({
    type: Actions.ButtonClick,
    data: '',
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
        const latestFeatures = await getAllFeatures()
        setAllFeatures(latestFeatures);
        setSelectedFeatureIdx(-1);
        resetButton();
      } else if (state.clickButton === 'export') {
        const featureStr = JSON.stringify(allFeature, null, ' ');
        const blob = new Blob([featureStr], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.style.display = 'none';
        downloadLink.href = url;
        downloadLink.download = "web-court-features.json";  
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();
        resetButton();
      } else if (state.clickButton === 'import') {
        if (fileInput.current) {
          fileInput.current.click();
        }
        resetButton();
      }
    })();
  }, [state]);
  
  const { featureTableType } = state;
  const selectedTable = allFeature[featureTableType] || [];

  const onClickFeature = (evt: React.MouseEvent<HTMLTableRowElement>, idx: number) => {
    setSelectedFeatureIdx(idx);
  }

  const onFileLoaded = async (evt: ProgressEvent<FileReader>) => {
    const fileContent = evt.target.result as string;
    let fileFeatureJson;
    try {
      fileFeatureJson = JSON.parse(fileContent);
      await saveAllFeature(fileFeatureJson);
    } catch (e) {
      alert('importing error: ' + e);
    }
  }


  const onFileChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    const input = evt.target;
    if (!input.files[0]) {
      return undefined;
    }
    const file = input.files[0];
    const fr = new FileReader();
    fr.onload = onFileLoaded;
    fr.readAsText(file);
    input.value = '';
  }

  return (
    selectedTable && selectedTable.length == 0 ?
    <div>No feature collected</div> :
    <div>
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
      <input type='file' id='import-file' accept='.json' onChange={onFileChange} ref={fileInput}/>
    </div>
  );
};

export default FeatureTable;
