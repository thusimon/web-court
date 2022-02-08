import React from 'react';
import { tabs, runtime } from 'webextension-polyfill';

import './content.scss';

const Content: React.FC = () => {
  const btnClickHandler = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    switch (evt.currentTarget.name) {
      case 'features': {
        tabs.create({url: runtime.getURL('pages/features/features.html')});
        break;
      }
      case 'options': {
        tabs.create({url: runtime.getURL('pages/options/options.html')});
        break;
      }
      default:
        break;
    }
  }
  return (<div className='content'>
    <div className='content-btn-group'>
      <button className='content-btn' name='features' onClick={btnClickHandler}>Features</button>
      <button className='content-btn' name='options' onClick={btnClickHandler}>Options</button>
    </div>
  </div>);
}

export default Content;
