import * as browser from 'webextension-polyfill';
import { Menus, Tabs } from 'webextension-polyfill';
import { CONTEXT_MENU_IDS } from './constants';

const contextMenuClickHandler = (info: Menus.OnClickData, tab: Tabs.Tab) => {
  console.log(info, tab);
}

// create context menu
browser.contextMenus.create({
  title: 'Label Username', 
  contexts:['all'], 
  id: CONTEXT_MENU_IDS.LABLE_USERNAME
});

browser.contextMenus.create({
  title: 'Yes',
  contexts:['all'],
  parentId: CONTEXT_MENU_IDS.LABLE_USERNAME,
  id: CONTEXT_MENU_IDS.LABEL_USERNAME_YES
});

browser.contextMenus.create({
  title: 'No',
  contexts:['all'],
  parentId: CONTEXT_MENU_IDS.LABLE_USERNAME,
  id: CONTEXT_MENU_IDS.LABEL_USERNAME_NO
});


browser.contextMenus.onClicked.addListener(contextMenuClickHandler);
