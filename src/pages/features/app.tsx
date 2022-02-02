import React, {useState, useEffect} from 'react';
import FeatureTable from './components/feature-table';
import { getFeatures } from '../../content/utils/storage';
import { FeatureCategory } from '../../constants';
const App = () => {
  const [features, setFeatures] = useState({
    page: [],
    field: []
  });

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
    <div id='page-feature'>
      <FeatureTable features={features.page}></FeatureTable>
    </div>
    <hr />
    <div id='field-feature'>
      <FeatureTable features={features.field}></FeatureTable>
    </div>
  </div>);
};

export default App;
