import * as browser from 'webextension-polyfill';
import { Menus, Tabs } from 'webextension-polyfill';
import { CONTEXT_MENU_IDS, MessageType } from './constants';
import { loadModelInFromIndexDB } from './common/storage';
import { sendMessageToTab } from './common/tabs';

// create context menu

// submit feature menus
browser.contextMenus.create({
  title: 'Button',
  contexts: ['all'],
  id: CONTEXT_MENU_IDS.LABEL_BUTTON
}, () => browser.runtime.lastError);

browser.contextMenus.create({
  title: 'Submit && Other',
  contexts: ['all'],
  parentId: CONTEXT_MENU_IDS.LABEL_BUTTON,
  id: CONTEXT_MENU_IDS.LABEL_SUBMIT_OTHER
}, () => browser.runtime.lastError);

browser.contextMenus.create({
  title: 'Other',
  contexts: ['all'],
  parentId: CONTEXT_MENU_IDS.LABEL_BUTTON,
  id: CONTEXT_MENU_IDS.LABEL_BUTTON_OTHER
}, () => browser.runtime.lastError);

browser.contextMenus.create({
  title: 'Submit',
  contexts: ['all'],
  parentId: CONTEXT_MENU_IDS.LABEL_BUTTON,
  id: CONTEXT_MENU_IDS.LABEL_SUBMIT_ONLY
}, () => browser.runtime.lastError);

browser.contextMenus.create({
  title: 'All Other',
  contexts: ['all'],
  parentId: CONTEXT_MENU_IDS.LABEL_BUTTON,
  id: CONTEXT_MENU_IDS.LABEL_BUTTON_OTHER_ALL
}, () => browser.runtime.lastError);

// input feature menus
browser.contextMenus.create({
  title: 'Inputs', 
  contexts: ['all'], 
  id: CONTEXT_MENU_IDS.LABEL_INPUT
}, () => browser.runtime.lastError);

browser.contextMenus.create({
  title: 'Other',
  contexts: ['all'],
  parentId: CONTEXT_MENU_IDS.LABEL_INPUT,
  id: CONTEXT_MENU_IDS.LABEL_INPUT_OTHER
}, () => browser.runtime.lastError);

browser.contextMenus.create({
  title: 'Username',
  contexts: ['all'],
  parentId: CONTEXT_MENU_IDS.LABEL_INPUT,
  id: CONTEXT_MENU_IDS.LABEL_USERNAME
}, () => browser.runtime.lastError);

browser.contextMenus.create({
  title: 'Password',
  contexts: ['all'],
  parentId: CONTEXT_MENU_IDS.LABEL_INPUT,
  id: CONTEXT_MENU_IDS.LABEL_PASSWORD
}, () => browser.runtime.lastError);

//
browser.contextMenus.create({
  title: 'Label Page', 
  contexts:['all'], 
  id: CONTEXT_MENU_IDS.LABEL_PAGE
}, () => browser.runtime.lastError);

// Page feature context menus
browser.contextMenus.create({
  title: 'Other', 
  contexts: ['all'],
  parentId: CONTEXT_MENU_IDS.LABEL_PAGE,
  id: CONTEXT_MENU_IDS.LABEL_PAGE_OTHER
}, () => browser.runtime.lastError);

browser.contextMenus.create({
  title: 'Login', 
  contexts: ['all'],
  parentId: CONTEXT_MENU_IDS.LABEL_PAGE,
  id: CONTEXT_MENU_IDS.LABEL_LOGIN
}, () => browser.runtime.lastError);

browser.contextMenus.create({
  title: 'Change Password', 
  contexts: ['all'],
  parentId: CONTEXT_MENU_IDS.LABEL_PAGE,
  id: CONTEXT_MENU_IDS.LABEL_CHANGE_PASS
}, () => browser.runtime.lastError);

browser.contextMenus.create({
  title: 'Sign Up', 
  contexts: ['all'],
  parentId: CONTEXT_MENU_IDS.LABEL_PAGE,
  id: CONTEXT_MENU_IDS.LABEL_SIGNUP
}, () => browser.runtime.lastError);

browser.contextMenus.create({
  title: 'Clear all', 
  contexts: ['all'], 
  id: CONTEXT_MENU_IDS.LABEL_CLEAR_ALL
}, () => browser.runtime.lastError);

const contextMenuClickHandler = (info: Menus.OnClickData, tab: Tabs.Tab) => {
  if (!tab.id) {
    console.log('no tab id, bail');
  }
  sendMessageToTab(tab.id, {
    type: MessageType.CONTEXT_CLICK,
    action: info.menuItemId,
    data: {
      url: tab.url
    }
  });
};

browser.contextMenus.onClicked.addListener(contextMenuClickHandler);


const messageHandler = (msg: any, sender: browser.Runtime.MessageSender) => {};

browser.runtime.onMessage.addListener(messageHandler);

loadModelInFromIndexDB('btn-model')
.then(console.log);