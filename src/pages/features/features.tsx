import ReactDOM from 'react-dom/client';
import { ContextProvider } from './context-provider';
import App from './app';

import './features.scss';

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
  <ContextProvider>
    <App />
  </ContextProvider>
);
