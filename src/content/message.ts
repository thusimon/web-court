import {
  getInputFeatures,
  getPageUsernamePasswordGeoFeatures,
  getButtonFeatures
} from './feature';
import { addFeature, addFeatureBulk } from '../common/storage';
import {
  highlightLabeledDoms,
  restoreDomHighlight,
  clearOverlay,
  findVisibleInputs,
  findVisibleButtons
} from './utils/dom';
import { Message, CONTEXT_MENU_IDS, LabelResult, FeatureCategory } from '../constants';
import Overlay from './components/overlay';

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
  CONTEXT_MENU_IDS.LABEL_CLEAR_ALL
]

export interface LabelData {
  url?: string;
  label?: LabelResult; 
};

export const handleLabel = async (message: Message, dom: HTMLElement, overlay: Overlay): Promise<void> => {
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
      const submitFeatures = await getButtonFeatures(dom, allVisiableInputs);
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
      const submitFeatures = await getButtonFeatures(dom, allVisiableInputs);
      const submitFeatureLabeled = {
        ...data,
        ...submitFeatures,
        label: LabelResult.field_submit
      };
      const otherButtons = findVisibleButtons().filter(button => button != dom);
      const otherButtonsFeatureLabeled = await Promise.all(otherButtons.map(async button => {
        const buttonFeature = await getButtonFeatures(button, allVisiableInputs);
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
      const submitFeatures = await getButtonFeatures(dom, allVisiableInputs);
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
      const otherButtonFeatures = await getButtonFeatures(dom, allVisiableInputs);
      const otherFeatureLabeled = {
        ...data,
        ...otherButtonFeatures,
        label: LabelResult.other
      };
      const restButtons = findVisibleButtons().filter(button => button != dom);
      const restButtonsFeatureLabeled = await Promise.all(restButtons.map(async button => {
        const buttonFeature = await getButtonFeatures(button, allVisiableInputs);
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
    default:
      break;
  }
}