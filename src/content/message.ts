import {
  getInputFeatures,
  getPageUsernamePasswordGeoFeatures,
  getButtonFeatures
} from './feature';
import { addFeature, addFeatureBulk } from './utils/storage';
import {
  highlightLabeledDom,
  restoreDomHighlight,
  clearOverlay,
  findVisibleInputs,
  findVisibleButtons
} from './utils/dom';
import { Message, CONTEXT_MENU_IDS, FieldLabelResult, PageLabelResult, FeatureCategory } from '../constants';
import Overlay from './components/overlay';

const contextMenuActions = [
  CONTEXT_MENU_IDS.LABEL_USERNAME,
  CONTEXT_MENU_IDS.LABEL_PASSWORD,
  CONTEXT_MENU_IDS.LABEL_FIELD_OTHER,
  CONTEXT_MENU_IDS.LABEL_SUBMIT,
  CONTEXT_MENU_IDS.LABEL_BUTTON_OTHER,
  CONTEXT_MENU_IDS.LABEL_LOGIN,
  CONTEXT_MENU_IDS.LABEL_CHANGE_PASS,
  CONTEXT_MENU_IDS.LABEL_SIGNUP,
  CONTEXT_MENU_IDS.LABEL_PAGE_OTHER,
  CONTEXT_MENU_IDS.LABEL_CLEAR_ALL
]

export interface LabelData {
  url?: string;
  label?: FieldLabelResult | PageLabelResult 
};

export const handleLabel = (message: Message, dom: HTMLElement, overlay: Overlay): Promise<void> => {
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
        label: FieldLabelResult.username
      };
      return addFeature(FeatureCategory.Field, featureLabeled)
      .then(() => {
        highlightLabeledDom(dom);
      });
    }
    case CONTEXT_MENU_IDS.LABEL_PASSWORD: {
      const allVisiableInputs = findVisibleInputs();
      const inputFeatures = getInputFeatures(dom, allVisiableInputs);
      const featureLabeled = {
        ...data,
        ...inputFeatures,
        label: FieldLabelResult.password
      };
      return addFeature(FeatureCategory.Field, featureLabeled)
      .then(() => {
        highlightLabeledDom(dom);
      });
    }
    case CONTEXT_MENU_IDS.LABEL_FIELD_OTHER: {
      const allVisiableInputs = findVisibleInputs();
      const inputFeatures = getInputFeatures(dom, allVisiableInputs);
      const featureLabeled = {
        ...data,
        ...inputFeatures,
        label: FieldLabelResult.other
      };
      return addFeature(FeatureCategory.Field, featureLabeled)
      .then(() => {
        highlightLabeledDom(dom);
      });
    }
    case CONTEXT_MENU_IDS.LABEL_SUBMIT: {
      const allVisiableInputs = findVisibleInputs();
      const submitFeatures = getButtonFeatures(dom, allVisiableInputs);
      const submitFeatureLabeled = {
        ...data,
        ...submitFeatures,
        label: FieldLabelResult.submit
      };
      const otherButtons = findVisibleButtons().filter(button => button != dom);
      const otherButtonsFeatureLabeled = otherButtons.map(button => {
        const buttonFeature = getButtonFeatures(button, allVisiableInputs);
        return {
          ...data,
          ...buttonFeature,
          label: FieldLabelResult.other
        }
      });
      const allFeatures = [submitFeatureLabeled, ...otherButtonsFeatureLabeled]
      return addFeatureBulk(FeatureCategory.Submit, allFeatures)
      .then(() => {
        highlightLabeledDom(dom);
        clearOverlay(overlay);
      });
    }
    case CONTEXT_MENU_IDS.LABEL_BUTTON_OTHER: {
      const allVisiableInputs = findVisibleInputs();
      const submitFeatures = getButtonFeatures(dom, allVisiableInputs);
      const submitFeatureLabeled = {
        ...data,
        ...submitFeatures,
        label: FieldLabelResult.other
      };
      return addFeature(FeatureCategory.Submit, submitFeatureLabeled)
      .then(() => {
        highlightLabeledDom(dom);
        clearOverlay(overlay);
      });
    }
    case CONTEXT_MENU_IDS.LABEL_LOGIN: {
      const pageFeatures = getPageUsernamePasswordGeoFeatures();
      const featureLabeled = {
        label: PageLabelResult.login,
        ...data,
        ...pageFeatures
      };
      return addFeature(FeatureCategory.Page, featureLabeled)
      .then(() => {
        restoreDomHighlight(dom);
        clearOverlay(overlay);
      });
    }
    case CONTEXT_MENU_IDS.LABEL_CHANGE_PASS: {
      const pageFeatures = getPageUsernamePasswordGeoFeatures();
      const featureLabeled = {
        label: PageLabelResult.change_pass,
        ...data,
        ...pageFeatures
      };
      return addFeature(FeatureCategory.Page, featureLabeled)
      .then(() => {
        restoreDomHighlight(dom);
        clearOverlay(overlay);
      });
    }
    case CONTEXT_MENU_IDS.LABEL_SIGNUP: {
      const pageFeatures = getPageUsernamePasswordGeoFeatures();
      const featureLabeled = {
        label: PageLabelResult.signup,
        ...data,
        ...pageFeatures
      };
      return addFeature(FeatureCategory.Page, featureLabeled)
      .then(() => {
        restoreDomHighlight(dom);
        clearOverlay(overlay);
      });
    }
    case CONTEXT_MENU_IDS.LABEL_PAGE_OTHER: {
      const pageFeatures = getPageUsernamePasswordGeoFeatures();
      const featureLabeled = {
        label: PageLabelResult.other,
        ...data,
        ...pageFeatures
      };
      return addFeature(FeatureCategory.Page, featureLabeled)
      .then(() => {
        restoreDomHighlight(dom);
        clearOverlay(overlay);
      });
    }
    case CONTEXT_MENU_IDS.LABEL_CLEAR_ALL: {
      restoreDomHighlight(dom);
      clearOverlay(overlay);
      return Promise.resolve();
    }
    default:
      break;
  }
}