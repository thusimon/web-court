import {
  getInputFeatures,
  getPageUsernamePasswordGeoFeatures,
  getButtonFeatures
} from './feature';
import { addFeature, addFeatureBulk, loadModelInFromIndexDB } from '../common/storage';
import {
  highlightLabeledDoms,
  restoreDomHighlight,
  clearOverlay,
  findVisibleInputs,
  findVisibleButtons,
  addPredictResultAboveDom,
  addRectOnPage,
  addButtonOnPage
} from './utils/dom';
import { Message, CONTEXT_MENU_IDS, LabelResult, FeatureCategory, MessageType } from '../constants';
import Overlay from './components/overlay';
import { processButtonFeature } from '../common/ai/utils/process-button-data';
import { sendMessageToExtension } from '../common/tabs';

const contextMenuActions = [
  CONTEXT_MENU_IDS.LABEL_USERNAME,
  CONTEXT_MENU_IDS.LABEL_PASSWORD,
  CONTEXT_MENU_IDS.LABEL_INPUT_OTHER,
  CONTEXT_MENU_IDS.LABEL_SUBMIT_OTHER,
  CONTEXT_MENU_IDS.LABEL_BUTTON_OTHER,
  CONTEXT_MENU_IDS.LABEL_LOGIN,
  CONTEXT_MENU_IDS.LABEL_CHANGE_PASS,
  CONTEXT_MENU_IDS.LABEL_SIGNUP,
  CONTEXT_MENU_IDS.LABEL_PAGE_OTHER,
  CONTEXT_MENU_IDS.LABEL_CLEAR_ALL,
  CONTEXT_MENU_IDS.LABEL_IMAGE
]

export interface LabelData {
  url?: string;
  label?: LabelResult; 
};

export interface PredictData {
  category: string;
}

export const handleLabel = async (message: Message, dom: HTMLElement, overlays: Overlay[]): Promise<void> => {
  const [overlay, overlayRectForm, overlayRectButton, overlaySave] = overlays;
  if (!dom) {
    return;
  }
  const action = message.action;
  const data = message.data as LabelData;
  if (!contextMenuActions.includes(action)) {
    return;
  }
  switch (action) {
    case CONTEXT_MENU_IDS.LABEL_USERNAME: {
      const allVisiableInputs = findVisibleInputs();
      const inputFeatures = getInputFeatures(dom, allVisiableInputs);
      const featureLabeled = {
        ...data,
        ...inputFeatures,
        label: LabelResult.field_username
      };
      return addFeature(FeatureCategory.Inputs, featureLabeled)
      .then(() => {
        highlightLabeledDoms([dom], 'blue');
      });
    }
    case CONTEXT_MENU_IDS.LABEL_PASSWORD: {
      const allVisiableInputs = findVisibleInputs();
      const inputFeatures = getInputFeatures(dom, allVisiableInputs);
      const featureLabeled = {
        ...data,
        ...inputFeatures,
        label: LabelResult.field_password
      };
      return addFeature(FeatureCategory.Inputs, featureLabeled)
      .then(() => {
        highlightLabeledDoms([dom], 'blue');
      });
    }
    case CONTEXT_MENU_IDS.LABEL_INPUT_OTHER: {
      const allVisiableInputs = findVisibleInputs();
      const inputFeatures = getInputFeatures(dom, allVisiableInputs);
      const featureLabeled = {
        ...data,
        ...inputFeatures,
        label: LabelResult.other
      };
      return addFeature(FeatureCategory.Inputs, featureLabeled)
      .then(() => {
        highlightLabeledDoms([dom], 'blue');
      });
    }
    case CONTEXT_MENU_IDS.LABEL_SUBMIT_ONLY: {
      const allVisiableInputs = findVisibleInputs();
      const submitFeatures = await getButtonFeatures(dom, allVisiableInputs, false);
      const submitFeatureLabeled = {
        ...data,
        ...submitFeatures,
        label: LabelResult.field_submit
      };
      return addFeature(FeatureCategory.Buttons, submitFeatureLabeled)
      .then(() => {
        highlightLabeledDoms([dom], 'blue');
        clearOverlay(overlay);
      });
    }
    case CONTEXT_MENU_IDS.LABEL_SUBMIT_OTHER: {
      const allVisiableInputs = findVisibleInputs();
      const submitFeatures = await getButtonFeatures(dom, allVisiableInputs, false);
      const submitFeatureLabeled = {
        ...data,
        ...submitFeatures,
        label: LabelResult.field_submit
      };
      const otherButtons = findVisibleButtons().filter(button => button != dom);
      const otherButtonsFeatureLabeled = await Promise.all(otherButtons.map(async button => {
        const buttonFeature = await getButtonFeatures(button, allVisiableInputs, false);
        return {
          ...data,
          ...buttonFeature,
          label: LabelResult.other
        }
      }));
      const allFeatures = [submitFeatureLabeled, ...otherButtonsFeatureLabeled]
      return addFeatureBulk(FeatureCategory.Buttons, allFeatures)
      .then(() => {
        highlightLabeledDoms([dom], 'blue');
        highlightLabeledDoms(otherButtons, 'red');
        clearOverlay(overlay);
      });
    }
    case CONTEXT_MENU_IDS.LABEL_BUTTON_OTHER: {
      const allVisiableInputs = findVisibleInputs();
      const submitFeatures = await getButtonFeatures(dom, allVisiableInputs, false);
      const submitFeatureLabeled = {
        ...data,
        ...submitFeatures,
        label: LabelResult.other
      };
      return addFeature(FeatureCategory.Buttons, submitFeatureLabeled)
      .then(() => {
        highlightLabeledDoms([dom], 'red');
        clearOverlay(overlay);
      });
    }
    case CONTEXT_MENU_IDS.LABEL_BUTTON_OTHER_ALL: {
      const allVisiableInputs = findVisibleInputs();
      const otherButtonFeatures = await getButtonFeatures(dom, allVisiableInputs, false);
      const otherFeatureLabeled = {
        ...data,
        ...otherButtonFeatures,
        label: LabelResult.other
      };
      const restButtons = findVisibleButtons().filter(button => button != dom);
      const restButtonsFeatureLabeled = await Promise.all(restButtons.map(async button => {
        const buttonFeature = await getButtonFeatures(button, allVisiableInputs, false);
        return {
          ...data,
          ...buttonFeature,
          label: LabelResult.other
        }
      }));
      const allFeatures = [otherFeatureLabeled, ...restButtonsFeatureLabeled]
      return addFeatureBulk(FeatureCategory.Buttons, allFeatures)
      .then(() => {
        highlightLabeledDoms([dom], 'red');
        highlightLabeledDoms(restButtons, 'red');
        clearOverlay(overlay);
      });
    }
    case CONTEXT_MENU_IDS.LABEL_LOGIN: {
      const pageFeatures = getPageUsernamePasswordGeoFeatures();
      const featureLabeled = {
        label: LabelResult.page_login,
        ...data,
        ...pageFeatures
      };
      return addFeature(FeatureCategory.Page, featureLabeled)
      .then(() => {
        restoreDomHighlight([dom]);
        clearOverlay(overlay);
      });
    }
    case CONTEXT_MENU_IDS.LABEL_CHANGE_PASS: {
      const pageFeatures = getPageUsernamePasswordGeoFeatures();
      const featureLabeled = {
        label: LabelResult.page_changepass,
        ...data,
        ...pageFeatures
      };
      return addFeature(FeatureCategory.Page, featureLabeled)
      .then(() => {
        restoreDomHighlight([dom]);
        clearOverlay(overlay);
      });
    }
    case CONTEXT_MENU_IDS.LABEL_SIGNUP: {
      const pageFeatures = getPageUsernamePasswordGeoFeatures();
      const featureLabeled = {
        label: LabelResult.page_signup,
        ...data,
        ...pageFeatures
      };
      return addFeature(FeatureCategory.Page, featureLabeled)
      .then(() => {
        restoreDomHighlight([dom]);
        clearOverlay(overlay);
      });
    }
    case CONTEXT_MENU_IDS.LABEL_PAGE_OTHER: {
      const pageFeatures = getPageUsernamePasswordGeoFeatures();
      const featureLabeled = {
        label: LabelResult.other,
        ...data,
        ...pageFeatures
      };
      return addFeature(FeatureCategory.Page, featureLabeled)
      .then(() => {
        restoreDomHighlight([dom]);
        clearOverlay(overlay);
      });
    }
    case CONTEXT_MENU_IDS.LABEL_CLEAR_ALL: {
      restoreDomHighlight([dom]);
      clearOverlay(overlay);
      return Promise.resolve();
    }
    case CONTEXT_MENU_IDS.LABEL_IMAGE: {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const formLeft = Math.max(windowWidth / 2 - 250, 0);
      const buttonLeft = Math.min(windowWidth / 2 + 250, windowWidth - 200);
      const saveLeft = Math.max(windowWidth - 60 - 40, 0);
      const rectTop = windowHeight / 2 - 100;
      const saveTop = 20;
      const rectFormPos = overlayRectForm.getBoundingClientRect();
      const rectButtonPos = overlayRectButton.getBoundingClientRect();
      const savePos = overlaySave.getBoundingClientRect();
      addRectOnPage(overlayRectForm, rectTop - rectFormPos.top, formLeft - rectFormPos.left, 'WebCourt: Login Form', 200, 200);
      addRectOnPage(overlayRectButton, rectTop - rectButtonPos.top, buttonLeft - rectButtonPos.left, 'WebCourt: Submit Button', 150, 80);
      addButtonOnPage(overlaySave, saveTop - savePos.top, saveLeft - savePos.left, 'Label', (evt) => {
        console.log('label button clicked!');
      }, 60, 30);
      return;
    }
    default:
      break;
  }
};

export const handlePredict = async (message: Message): Promise<void> => {
  const data = message.data as PredictData; 
  const category = data.category
  switch (category) {
    case 'predict-btn': {
      const allVisiableInputs = findVisibleInputs();
      const allVisibleButtons = findVisibleButtons();
      if (allVisibleButtons.length < 1) {
        break;
      }
      const allButtonFeatures = await Promise.all(allVisibleButtons.map(async button => {
        const buttonFeature =  await getButtonFeatures(button, allVisiableInputs, false);
        return {
          ...buttonFeature,
          label: LabelResult.field_submit
        }
      }));
      const buttonsFeature = processButtonFeature(allButtonFeatures);
      sendMessageToExtension({
        type: MessageType.BTN_FEATURE_PREDICT,
        data: buttonsFeature
      })
      .then(predictResult => {
        console.log(predictResult);
        const [submitLoss, otherLoss] = predictResult as number[][];
        const otherLossSorted = otherLoss.slice().sort().reverse();
        const otherLossMap = otherLoss.map(prob => ({
          prob,
          order: otherLossSorted.indexOf(prob)
        }));
        otherLossMap.forEach((result, idx) => {
          const button = allVisibleButtons[idx];
          addPredictResultAboveDom(button, result.prob, result.order);
        });
      });
      break;
    }
    default:
      break;
  }
};
