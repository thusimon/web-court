import React, {useState, useEffect, useContext} from 'react';
import FeatureTable from './components/feature-table';
import { getFeatures } from '../../content/utils/storage';
import { FeatureCategory } from '../../constants';
import Nav from './components/nav';
import { AppContext } from './context-provider';
import './app.scss';

const App = () => {
  const [features, setFeatures] = useState({
    page: [],
    field: []
  });
  const { state } = useContext(AppContext);

  useEffect(() => {
    (async () => {
      const pageFeatures = await getFeatures(FeatureCategory.Page);
      const fieldFeatures = await getFeatures(FeatureCategory.Field);
      setFeatures({
        page: pageFeatures,
        field: fieldFeatures
      });
    })();
  }, []);

  return (<div id='container'>
    <Nav />
    <div id='feature'>
      <FeatureTable features={state.featureTableType === FeatureCategory.Page ? features.page : features.field}></FeatureTable>
    </div>
  </div>);
};

export default App;
