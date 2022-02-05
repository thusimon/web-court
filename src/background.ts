import * as browser from 'webextension-polyfill';
import { Menus, Tabs } from 'webextension-polyfill';
import { CONTEXT_MENU_IDS, MessageType } from './constants';

// create context menu
browser.contextMenus.create({
  title: 'Label Field', 
  contexts:['all'], 
  id: CONTEXT_MENU_IDS.LABEL_FIELD
}, () => browser.runtime.lastError);

browser.contextMenus.create({
  title: 'Username',
  contexts:['all'],
  parentId: CONTEXT_MENU_IDS.LABEL_FIELD,
  id: CONTEXT_MENU_IDS.LABEL_USERNAME
}, () => browser.runtime.lastError);

browser.contextMenus.create({
  title: 'Password',
  contexts:['all'],
  parentId: CONTEXT_MENU_IDS.LABEL_FIELD,
  id: CONTEXT_MENU_IDS.LABEL_PASSWORD
}, () => browser.runtime.lastError);

browser.contextMenus.create({
  title: 'Submit button',
  contexts:['all'],
  parentId: CONTEXT_MENU_IDS.LABEL_FIELD,
  id: CONTEXT_MENU_IDS.LABEL_SUBMIT
}, () => browser.runtime.lastError);

browser.contextMenus.create({
  title: 'Other',
  contexts:['all'],
  parentId: CONTEXT_MENU_IDS.LABEL_FIELD,
  id: CONTEXT_MENU_IDS.LABEL_FIELD_OTHER
}, () => browser.runtime.lastError);

browser.contextMenus.create({
  title: 'Label Page', 
  contexts:['all'], 
  id: CONTEXT_MENU_IDS.LABEL_PAGE
}, () => browser.runtime.lastError);

browser.contextMenus.create({
  title: 'Login', 
  contexts:['all'],
  parentId: CONTEXT_MENU_IDS.LABEL_PAGE,
  id: CONTEXT_MENU_IDS.LABEL_LOGIN
}, () => browser.runtime.lastError);

browser.contextMenus.create({
  title: 'Change Password', 
  contexts:['all'],
  parentId: CONTEXT_MENU_IDS.LABEL_PAGE,
  id: CONTEXT_MENU_IDS.LABEL_CHANGE_PASS
}, () => browser.runtime.lastError);

browser.contextMenus.create({
  title: 'Sign Up', 
  contexts:['all'],
  parentId: CONTEXT_MENU_IDS.LABEL_PAGE,
  id: CONTEXT_MENU_IDS.LABEL_SIGNUP
}, () => browser.runtime.lastError);

browser.contextMenus.create({
  title: 'Other', 
  contexts:['all'],
  parentId: CONTEXT_MENU_IDS.LABEL_PAGE,
  id: CONTEXT_MENU_IDS.LABEL_PAGE_OTHER
}, () => browser.runtime.lastError);

browser.contextMenus.create({
  title: 'Clear all', 
  contexts:['all'], 
  id: CONTEXT_MENU_IDS.LABEL_CLEAR_ALL
}, () => browser.runtime.lastError);

const contextMenuClickHandler = (info: Menus.OnClickData, tab: Tabs.Tab) => {
  if (!tab.id) {
    console.log('no tab id, bail');
  }
  browser.tabs.sendMessage(tab.id, {
    type: MessageType.CONTEXT_CLICK,
    action: info.menuItemId,
    data: {
      url: tab.url
    }
  });
};

browser.contextMenus.onClicked.addListener(contextMenuClickHandler);

browser.action.onClicked.addListener(async (tab) => {
  await browser.tabs.create({ url: browser.runtime.getURL('pages/options/options.html') })
})