import FeatureTable from './components/feature-table';
import Model from './components/model';
import Console from './components/console';
import Nav from './components/nav';

import './app.scss';

const App = () => {  
  return (<div id='container'>
    <Nav />
    <div id='feature'>
      <FeatureTable />
      <Model />
    </div>
    <div id='console'>
      <Console />
    </div>
  </div>);
};

export default App;
