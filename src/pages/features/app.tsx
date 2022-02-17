import React, {useState, useEffect, useContext} from 'react';
import FeatureTable from './components/feature-table';
import { deleteFeature, getFeatures } from '../../content/utils/storage';
import { FeatureCategory } from '../../constants';
import Nav from './components/nav';
import { AppContext } from './context-provider';
import './app.scss';
import { Actions } from './constants';

const App = () => {
  const [features, setFeatures] = useState({
    page: [],
    field: []
  });
  const { state, dispatch } = useContext(AppContext);

  const getAllFeatures = async () => {
    const pageFeatures = await getFeatures(FeatureCategory.Page);
    const fieldFeatures = await getFeatures(FeatureCategory.Field);
    setFeatures({
      page: pageFeatures,
      field: fieldFeatures
    });
  };

  useEffect(() => {
    getAllFeatures();
  }, []);

  const { featureTableType, changing, clickButton, selectFeatureIdx } = state;
  if (changing && selectFeatureIdx > -1) {
    if (clickButton === 'delete') {
      deleteFeature(featureTableType, selectFeatureIdx)
      .then(() => {
        getAllFeatures();
        dispatch({
          type: Actions.UpdateChanging,
          data: false,
        });
      });
    }
  }
  
  return (<div id='container'>
    <Nav />
    <div id='feature'>
      <FeatureTable features={features} featureTableType={featureTableType}></FeatureTable>
    </div>
  </div>);
};

export default App;
