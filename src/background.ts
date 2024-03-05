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

const yolo_classes = [
  'login_form',
  'login_button'
];

function process_output(output: any, img_width: number, img_height: number) {
  let boxes: any = [];
  for (let index=0;index<8400;index++) {
      const [class_id,prob] = [...Array(80).keys()]
          .map(col => [col, output[8400*(col+4)+index]])
          .reduce((accum, item) => item[1]>accum[1] ? item : accum,[0,0]);
      if (prob < 0.5) {
          continue;
      }
      const label = yolo_classes[class_id];
      const xc = output[index];
      const yc = output[8400+index];
      const w = output[2*8400+index];
      const h = output[3*8400+index];
      const x1 = (xc-w/2)/640*img_width;
      const y1 = (yc-h/2)/640*img_height;
      const x2 = (xc+w/2)/640*img_width;
      const y2 = (yc+h/2)/640*img_height;
      boxes.push([x1,y1,x2,y2,label,prob]);
  }

  // boxes = boxes.sort((box1,box2) => box2[5]-box1[5])
  // const result = [];
  // while (boxes.length>0) {
  //     result.push(boxes[0]);
  //     boxes = boxes.filter(box => iou(boxes[0],box)<0.7);
  // }
  // return result;
}

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
      console.log(`get image: ${Date.now() - startTime}ms`);
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
      console.log(`preprocess: ${Date.now() - startTime}`);
      // tf.tidy(function() {
      //   //const predictTensor = localModel.predict(resizedTensor.expandDims()) as tf.Tensor<tf.Rank>;
      //   //const result = predictTensor.dataSync();
      //   const result = localModel.predict(resizedTensor.expandDims());
      //   console.log(result)
      // })
      const res = localModel.execute(input) as tf.Tensor<tf.Rank>; // inference model
      const transRes = res.transpose([0, 2, 1]); // transpose result [b, det, n] => [b, n, det]
      console.log(transRes)
      const boxes = tf.tidy(() => {
        const w = transRes.slice([0, 0, 2], [-1, -1, 1]); // get width
        const h = transRes.slice([0, 0, 3], [-1, -1, 1]); // get height
        const x1 = tf.sub(transRes.slice([0, 0, 0], [-1, -1, 1]), tf.div(w, 2)); // x1
        const y1 = tf.sub(transRes.slice([0, 0, 1], [-1, -1, 1]), tf.div(h, 2)); // y1
        return tf
          .concat(
            [
              y1,
              x1,
              tf.add(y1, h), //y2
              tf.add(x1, w), //x2
            ],
            2
          )
          .squeeze();
      });
      console.log(251, boxes)

      const [scores, classes] = tf.tidy(() => {
        // class scores
        const rawScores = transRes.slice([0, 0, 4], [-1, -1, yolo_classes.length]).squeeze(); // #6 only squeeze axis 0 to handle only 1 class models
        return [rawScores.max(1), rawScores.argMax(1)];
      }); // get max scores and classes index
      console.log(258, scores, classes)

      const nms = await tf.image.nonMaxSuppressionAsync(boxes as tf.Tensor2D, scores, 500, 0.45, 0.2); // NMS to filter boxes

      const boxes_data = boxes.gather(nms, 0).dataSync(); // indexing boxes by nms index
      const scores_data = scores.gather(nms, 0).dataSync(); // indexing scores by nms index
      const classes_data = classes.gather(nms, 0).dataSync(); // indexing classes by nms index

      console.log(266, boxes_data, scores_data, classes_data);
      console.log(`Spend: ${Date.now() - startTime}ms`);
      
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
  const url = browser.runtime.getURL('model/yolov8m/model.json');
  localModel = await tf.loadGraphModel(url);
  console.log('local model loaded');

  try {
    await loadModelInFromIndexDB('btn-model');
  } catch (err) {
    console.log(`failed to load model from indexDB, err: ${err}`);
  }

})()
