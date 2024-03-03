import * as browser from 'webextension-polyfill';
import * as tf from '@tensorflow/tfjs';
import { Menus, Tabs } from 'webextension-polyfill';
import { CONTEXT_MENU_IDS, Message, MessageType } from './constants';
import { loadModelInFromIndexDB, saveImageLabelData } from './common/storage';
import { sendMessageToTab } from './common/tabs';
import { GeneralFeature } from './content/feature';
import { processButtonFeature } from './common/ai/utils/process-button-data';
import { ButtonClass, getFeatureData } from './common/ai/utils/data';
import { getCenter, dataURLtoBlob, dataURItoBlob, blobToDataURI } from './common/misc';

let localModel: tf.GraphModel;

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

browser.contextMenus.create({
  title: 'Label Image', 
  contexts: ['all'], 
  id: CONTEXT_MENU_IDS.LABEL_IMAGE
}, () => browser.runtime.lastError);

browser.contextMenus.create({
  title: 'Predict',
  contexts: ['all'],
  id: CONTEXT_MENU_IDS.PRIDICT_IMAGE
}, () => browser.runtime.lastError);

let isLabeling = false;

const preprocess = (source: ImageBitmap, modelWidth: number, modelHeight: number) => {
  let xRatio, yRatio; // ratios for boxes

  const input = tf.tidy(() => {
    const imgTensor = tf.browser.fromPixels(source);

    // padding image to square => [n, m] to [n, n], n > m
    // const [h, w] = img.shape.slice(0, 2); // get source width and height
    // const maxSize = Math.max(w, h); // get max size
    // const imgPadded = img.pad([
    //   [0, maxSize - h], // padding y [bottom only]
    //   [0, maxSize - w], // padding x [right only]
    //   [0, 0],
    // ]);

    // xRatio = maxSize / w; // update xRatio
    // yRatio = maxSize / h; // update yRatio

    return tf.image
      .resizeBilinear(imgTensor, [modelWidth, modelHeight]) // resize frame
      .div(255.0) // normalize
      .expandDims(0); // add batch
  });

  return [input, xRatio, yRatio];
};

const contextMenuClickHandler = async (info: Menus.OnClickData, tab: Tabs.Tab) => {
  if (!tab.id) {
    console.log('no tab id, bail');
    return;
  }
  switch (info.menuItemId) {
    case CONTEXT_MENU_IDS.PRIDICT_IMAGE: {
      const startTime = Date.now();
      console.log(`start: ${startTime}`);
      const imageDataUri = await browser.tabs.captureVisibleTab(browser.windows.WINDOW_ID_CURRENT, {format: 'png'});
      const blob = await dataURItoBlob(imageDataUri);
      const bitmap = await createImageBitmap(blob);
      //const canvas = new OffscreenCanvas(640, 640);
      //const ctx = canvas.getContext('2d');
      //ctx.drawImage(bitmap, 0, 0, 640, 640);
      //const resizedImgData = ctx.getImageData(0, 0, 640, 640);
      //const resizedBlob = await canvas.convertToBlob();
      //const resizedImageUri = await blobToDataURI(resizedBlob);
      //const imageTensor = tf.browser.fromPixels(bitmap);
      //const resizedTensor = tf.image.resizeBilinear(imageTensor, [640, 640], true);
      //const resized = tf.cast(resizedTensor, 'float32');
      //const t4d = tf.tensor4d(Array.from(resized.dataSync()),[1, 640, 640, 3])
      const [input] = preprocess(bitmap, 640, 640);
      if (!localModel) {
        return;
      }
      // tf.tidy(function() {
      //   //const predictTensor = localModel.predict(resizedTensor.expandDims()) as tf.Tensor<tf.Rank>;
      //   //const result = predictTensor.dataSync();
      //   const result = localModel.predict(resizedTensor.expandDims());
      //   console.log(result)
      // })
      const res = await localModel.executeAsync(input); // inference model
      console.log(`Spend: ${Date.now() - startTime}ms`);
      console.log(res);
      break;
    }
    case CONTEXT_MENU_IDS.LABEL_IMAGE: {
      isLabeling = true;
    }
    default: {
      sendMessageToTab(tab.id, {
        type: MessageType.CONTEXT_CLICK,
        action: info.menuItemId,
        data: {
          url: tab.url
        }
      });
    }
  }
};

browser.contextMenus.onClicked.addListener(contextMenuClickHandler);

// do not use async listener callback, since it will block all the other messages, impairs performance
// return promise inside the handler instead
const messageHandler = async (msg: Message, sender: browser.Runtime.MessageSender) => {
  const {type, data} = msg;
  switch (type) {
    case MessageType.BTN_FEATURE_PREDICT: {
      const buttonsFeature = data as GeneralFeature[];
      const processedButtonsFeature = processButtonFeature(buttonsFeature);
      const buttonsFeatureTensorSplited = getFeatureData(processedButtonsFeature, ButtonClass, 0, false, false);
      const buttonsFeatureTensor = buttonsFeatureTensorSplited[0];
      return loadModelInFromIndexDB('btn-model')
      .then(model => {
        const predictTensor = model.predict(buttonsFeatureTensor) as tf.Tensor<tf.Rank>;
        return predictTensor;
      })
      .then(rank => {
        const classNum = rank.shape[1];
        const predictResult: number[][] = [];
        for (let classIdx = 0; classIdx < classNum; classIdx++) {
          const classIProbabilitiesArr = rank.gather([classIdx], 1).dataSync() as Float32Array;
          const classIProbabilities = Array.from(classIProbabilitiesArr);
          predictResult.push(classIProbabilities)
        }
        return predictResult;
      })
    }
    case MessageType.LABEL_IMAGE: {
      isLabeling = false;
      const {labels, url} = data;
      const {form, button} = labels;
      /**
       * get the feature array
       * [
       *   form center x
       *   form center y
       *   form width
       *   form height
       *   button center x
       *   button center y
       *   button width
       *   button height
       * ]
       */
      const feature = [...getCenter(form), ...getCenter(button)];
      try {
        const wholeImage = await browser.tabs.captureVisibleTab(browser.windows.WINDOW_ID_CURRENT, {format: 'png'});
        await saveImageLabelData(url, wholeImage, feature);
      } catch(e) {
        console.log(e);
      }
      break;
    }
    default:
      break;
  }
};

browser.runtime.onMessage.addListener(messageHandler);

const commandHandler = async (command: string, tab: Tabs.Tab) => {
  switch(command) {
    case 'capture-screen': {
      if (!isLabeling) {
        // not labeling should not capture
        break;
      }
      const result = await sendMessageToTab(tab.id, {
        type: MessageType.CONTEXT_CLICK,
        action: CONTEXT_MENU_IDS.LABEL_CLEAR_ALL
      });
      console.log(result);
      const url = tab.url;
      const feature = Array(8).fill(0);
      const wholeImage = await browser.tabs.captureVisibleTab(browser.windows.WINDOW_ID_CURRENT, {format: 'png'});
      await saveImageLabelData(url, wholeImage, feature);
      break;
    }
    default:
      break;
  }
}

browser.commands.onCommand.addListener(commandHandler);

(async () => {
  const url = browser.runtime.getURL('model/yolov8s/model.json');
  localModel = await tf.loadGraphModel(url);
  console.log('local model loaded');

  try {
    await loadModelInFromIndexDB('btn-model');
  } catch (err) {
    console.log(`failed to load model from indexDB, err: ${err}`);
  }

})()
