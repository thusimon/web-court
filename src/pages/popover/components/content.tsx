import React from 'react';
import { MessageType } from '../../../constants';
import { createTab, getCurrentTab, sendMessageToTab } from '../../../common/tabs';
import { runtime } from 'webextension-polyfill';

import './content.scss';

const Content: React.FC = () => {
  const btnClickHandler = async (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const buttonName = evt.currentTarget.name;
    switch (buttonName) {
      case 'features': {
        createTab(runtime.getURL('pages/features/features.html'));
        break;
      }
      case 'options': {
        createTab(runtime.getURL('pages/options/options.html'));
        break;
      }
      case 'predict-btn': {
        const currentTab = await getCurrentTab();
        sendMessageToTab(currentTab.id, {
          type: MessageType.BTN_FEATURE_COLLECT,
          data: {
            category: buttonName
          }
        });
        break;
      }
      default:
        break;
    }
  }
  return (<div className='content'>
    <div className='content-btn-group'>
      <button className='content-btn' name='predict-btn' onClick={btnClickHandler}>Predict Buttons</button>
    </div>
    <hr></hr>
    <div className='content-btn-group'>
      <button className='content-btn' name='features' onClick={btnClickHandler}>Features</button>
      <button className='content-btn' name='options' onClick={btnClickHandler}>Options</button>
    </div>
  </div>);
}

export default Content;
