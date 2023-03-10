import ReactDOM from 'react-dom';

import './options.scss';

ReactDOM.render(
  <div>
    <h1>Web-Court Options</h1>
    <div>
      <input type='radio' value='dom-feature' name='feature-type' />
      <label>Dom Feature</label>
      <input type='radio' value='image-feature' name='feature-type' />
      <label>Image Feature</label>
    </div>
  </div>,
  document.getElementById('app')
);