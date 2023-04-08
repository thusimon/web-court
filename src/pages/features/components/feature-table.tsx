import React, { useState, useContext, useEffect, useRef } from 'react';
import { AppContext, AppContextType } from '../context-provider';
import { Actions, IMAGE_PNG_URI_PREFIX } from '../constants';
import { FeatureCategory, FeaturesType } from '../../../constants';
import { constructPageFeatureOrdered } from '../../../content/feature';
import { clearAllData, deleteFeature, deleteFeatureCategory, deleteImageLabelData, getAllData, getAllFeatures, getAllImageLabelKeys, saveAllData } from '../../../common/storage';
import { isString, isDate } from 'lodash';
import ImageFeature from './image-feature';

import './feature-table.scss';

export interface FeatureTablePropsType {
  features: FeaturesType;
  featureCategory: FeatureCategory;
  selectFeatureIdx: number;
}

const parseFeatureTableValue = (featureValue: any) => {
  if (isString(featureValue) && featureValue.startsWith(IMAGE_PNG_URI_PREFIX)) {
    // image feature
    return <ImageFeature imgUri={featureValue}/>
  }
  if (isDate(featureValue)) {
    return featureValue.toLocaleDateString('en-US', {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false});
  }
  return featureValue;
};

const parseFeatureTableTitle = (featureValue: any) => {
  if (isString(featureValue) && featureValue.startsWith(IMAGE_PNG_URI_PREFIX)) {
    return ''
  }
  return featureValue;
};

const FeatureTable = () => {
  const { state, dispatch } = useContext(AppContext);
  const [ selectedFeatureIdx, setSelectedFeatureIdx ] = useState(-1);
  const fileInput = useRef(null);
  const [ allFeatures, setAllFeatures ] = useState<FeaturesType>({
    Page: [],
    Inputs: [],
    Buttons: [],
    Images: []
  });
  const [filteredFeature, setFilteredFeature] = useState([]);

  const dispatchButton = (button: string) => {
    dispatch({
      type: Actions.ButtonClick,
      data: button,
    });
  };

  const refresh = async () => {
    const allFeatures = await getAllFeatures();
    const { featureCategory } = state;
    const selectedTable = allFeatures[featureCategory] || [];
    setFilteredFeature(selectedTable);
    setAllFeatures(allFeatures);
  };

  const handleButton = async (state: AppContextType) => {
    const {clickButton, featureCategory} = state;
    switch (clickButton) {
      case 'delete-one': {
        //TODO add confirm dialog
        if (featureCategory != FeatureCategory.Images) {
          await deleteFeature(featureCategory, selectedFeatureIdx);
        } else {
          const imageFeature = allFeatures[FeatureCategory.Images][selectedFeatureIdx];
          if (!imageFeature) {
            break;
          }
          await deleteImageLabelData(parseInt(imageFeature.id as any));
        }
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
  }

  const handleSearch = async (state: AppContextType) => {
    const {searchProp, searchVal, featureCategory} = state;
    const selectedTable = allFeatures[featureCategory] || [];
    if (!searchProp || !searchVal) {
      setFilteredFeature(selectedTable);
      return;
    }
    const filteredTable = selectedTable.filter(row => {
      var rowVal = row[searchProp];
      return rowVal && rowVal.toString().includes(searchVal);
    });
    setFilteredFeature(filteredTable);
  }

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    handleButton(state);
  }, [state.clickButton]);

  useEffect(() => {
    handleSearch(state);
  }, [state.searchProp, state.searchVal]);

  useEffect(() => {
    const { featureCategory } = state;
    const selectedTable = allFeatures[featureCategory] || [];
    setFilteredFeature(selectedTable);
  }, [state.featureCategory]);

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
    filteredFeature && filteredFeature.length == 0 ?
    <div>
      <p>No feature collected</p>
      <input type='file' id='import-file' accept='.json' onChange={onFileChange} ref={fileInput}/>
    </div> :
    <div>
      <table className='feature-table'>
        <thead>
          <tr>
            { constructPageFeatureOrdered(filteredFeature[0]).key.map(key => <th key={key}>{key}</th>) }
          </tr>
        </thead>
        <tbody>
        {
          filteredFeature.map((feature, fidx) => <tr key={`${fidx}`}
            onClick={(evt) => onClickFeature(evt, fidx)}
            className={fidx === selectedFeatureIdx ? 'selected' : 'non-selected'}>{
            constructPageFeatureOrdered(feature).value.map((fv, fvidx) => <td
              key={`${fidx}-${fvidx}`} 
              title={parseFeatureTableTitle(fv)}>
                {parseFeatureTableValue(fv)}
            </td>)
          }</tr>)
        }
        </tbody>
      </table>
      <input type='file' id='import-file' accept='.json' onChange={onFileChange} ref={fileInput}/>
    </div>
  );
};

export default FeatureTable;
