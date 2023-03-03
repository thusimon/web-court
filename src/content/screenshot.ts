import * as browser from 'webextension-polyfill';
class Screenshot {
  constructor() {}

  takeScreenshot(rect: DOMRect){
    let allScreenshot;
    try {
      allScreenshot = browser.tabs.captureVisibleTab(browser.windows.WINDOW_ID_CURRENT, {format: 'png'});
    } catch(e) {
      console.log(e);
    }
  }
}

export default Screenshot;
