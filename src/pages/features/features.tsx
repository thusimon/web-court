import ReactDOM from 'react-dom';
import { ContextProvider } from './context-provider';
import App from './app';

import './features.scss';

ReactDOM.render(
  <ContextProvider>
    <App />
  </ContextProvider>,
  document.getElementById('app')
);
