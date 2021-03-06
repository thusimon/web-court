import React, { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '../context-provider';
import { Actions } from '../constants';
import { FeatureCategory, FeaturesType } from '../../../constants';
import { constructPageFeatureOrdered } from '../../../content/feature';
import { clearAllData, deleteFeature, deleteFeatureCategory, getAllData, getAllFeatures, saveAllData } from '../../../common/storage';

import './feature-table.scss';

export interface FeatureTablePropsType {
  features: FeaturesType;
  featureCategory: FeatureCategory;
  selectFeatureIdx: number;
}

const FeatureTable = () => {
  const { state, dispatch } = useContext(AppContext);
  const [ selectedFeatureIdx, setSelectedFeatureIdx ] = useState(-1);
  const fileInput = useRef(null);
  const [ allFeature, setAllFeatures ] = useState<FeaturesType>({
    Page: [],
    Inputs: [],
    Buttons: []
  });

  const dispatchButton = (button: string) => {
    dispatch({
      type: Actions.ButtonClick,
      data: button,
    });
  };

  const refresh = async () => {
    const allFeatures = await getAllFeatures();
    setAllFeatures(allFeatures);
  };

  useEffect(() => {
    refresh();
  }, []);
  useEffect(() => {
    (async () => {
      const button = state.clickButton;
      switch (button) {
        case 'delete-one': {
          //TODO add confirm dialog
          await deleteFeature(featureCategory, selectedFeatureIdx);
          await refresh();
          setSelectedFeatureIdx(-1);
          dispatchButton('refresh');
          dispatchButton('');
          break;
        }
        case 'delete-catetory': {
          await deleteFeatureCategory(featureCategory);
          await refresh();
          setSelectedFeatureIdx(-1);
          dispatchButton('refresh');
          dispatchButton('');
          break;
        }
        case 'export': {
          const allStorageData = await getAllData();
          const dataStr = JSON.stringify(allStorageData, null, ' ');
          const blob = new Blob([dataStr], {type: "application/json"});
          const url = URL.createObjectURL(blob);
          const downloadLink = document.createElement('a');
          downloadLink.style.display = 'none';
          downloadLink.href = url;
          downloadLink.download = "web-court-features.json";  
          document.body.appendChild(downloadLink);
          downloadLink.click();
          downloadLink.remove();
          dispatchButton('');
          break;
        }
        case 'import': {
          if (fileInput.current) {
            fileInput.current.click();
          }
          dispatchButton('');
        }
        case 'refresh': {
          await refresh();
          dispatchButton('');
        }
        default:
          break;
      }
    })();
  }, [state]);
  
  const { featureCategory } = state;
  const selectedTable = allFeature[featureCategory] || [];

  const onClickFeature = (evt: React.MouseEvent<HTMLTableRowElement>, idx: number) => {
    setSelectedFeatureIdx(idx);
  }

  const onFileLoaded = async (evt: ProgressEvent<FileReader>) => {
    const fileContent = evt.target.result as string;
    let fileFeatureJson;
    try {
      fileFeatureJson = JSON.parse(fileContent);
      await clearAllData();
      await saveAllData(fileFeatureJson);
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
    <div>
      <p>No feature collected</p>
      <input type='file' id='import-file' accept='.json' onChange={onFileChange} ref={fileInput}/>
    </div> :
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
