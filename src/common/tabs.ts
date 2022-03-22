import * as browser from 'webextension-polyfill';

export const getCurrentTab = async (): Promise<browser.Tabs.Tab> => {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await browser.tabs.query(queryOptions);
  return tab;
};

export const sendMessageToTab = (tabId: number, message: any) => {
  browser.tabs.sendMessage(tabId, message);
};

export const sendMessageToExtension = (message: any) => {
  return browser.runtime.sendMessage(message);
}

export const createTab = (url: string) => {
  browser.tabs.create( { url } );
};
