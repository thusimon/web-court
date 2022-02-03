import { getInputFieldFeatures, getPageFeatures } from './feature';
import { addFeature, PageFeatureLabeled } from './utils/storage';
import {
  highlightLabeledDom,
  restoreDomHighlight,
  clearOverlay
} from './utils/dom';
import { Message, CONTEXT_MENU_IDS, FieldLabelResult, PageLabelResult, FeatureCategory } from '../constants';
import Overlay from './components/overlay';

const contextMenuActions = [
  CONTEXT_MENU_IDS.LABEL_USERNAME,
  CONTEXT_MENU_IDS.LABEL_PASSWORD,
  CONTEXT_MENU_IDS.LABEL_SUBMIT,
  CONTEXT_MENU_IDS.LABEL_FIELD_OTHER,
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

export const handleLabel = (message: Message, dom: HTMLElement, overlay: Overlay) => {
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
      const inputFeatures = getInputFieldFeatures(dom as HTMLInputElement);
      const featureLabeled = {
        ...data,
        ...inputFeatures,
        label: FieldLabelResult.username
      }
      return addFeature(FeatureCategory.Field, featureLabeled)
      .then(() => {
        highlightLabeledDom(dom);
      });
    }
    case CONTEXT_MENU_IDS.LABEL_PASSWORD: {
      const inputFeatures = getInputFieldFeatures(dom as HTMLInputElement);
      const featureLabeled = {
        ...data,
        ...inputFeatures,
        label: FieldLabelResult.password
      }
      return addFeature(FeatureCategory.Field, featureLabeled)
      .then(() => {
        highlightLabeledDom(dom);
      });;
    }
    case CONTEXT_MENU_IDS.LABEL_SUBMIT: {
      return Promise.resolve(true);
    }
    case CONTEXT_MENU_IDS.LABEL_FIELD_OTHER: {
      const inputFeatures = getInputFieldFeatures(dom as HTMLInputElement);
      const featureLabeled = {
        ...data,
        ...inputFeatures,
        label: FieldLabelResult.unknown
      }
      return addFeature(FeatureCategory.Field, featureLabeled)
      .then(() => {
        highlightLabeledDom(dom);
      });;
    }
    case CONTEXT_MENU_IDS.LABEL_LOGIN: {
      const pageFeatures = getPageFeatures();
      const featureLabeled = {
        ...data,
        ...pageFeatures,
        label: PageLabelResult.login
      } as PageFeatureLabeled;
      return addFeature(FeatureCategory.Page, featureLabeled)
      .then(() => {
        restoreDomHighlight(dom),
        clearOverlay(overlay);
      });
    }
    case CONTEXT_MENU_IDS.LABEL_CHANGE_PASS: {
      const pageFeatures = getPageFeatures();
      const featureLabeled = {
        ...data,
        ...pageFeatures,
        label: PageLabelResult.change_pass
      } as PageFeatureLabeled;
      return addFeature(FeatureCategory.Page, featureLabeled)
      .then(() => {
        restoreDomHighlight(dom),
        clearOverlay(overlay);
      });
    }
    case CONTEXT_MENU_IDS.LABEL_SIGNUP: {
      const pageFeatures = getPageFeatures();
      const featureLabeled = {
        ...data,
        ...pageFeatures,
        label: PageLabelResult.signup
      } as PageFeatureLabeled;
      return addFeature(FeatureCategory.Page, featureLabeled)
      .then(() => {
        restoreDomHighlight(dom),
        clearOverlay(overlay);
      });
    }
    case CONTEXT_MENU_IDS.LABEL_PAGE_OTHER: {
      const pageFeatures = getPageFeatures();
      const featureLabeled = {
        ...data,
        ...pageFeatures,
        label: PageLabelResult.unknown
      } as PageFeatureLabeled;
      return addFeature(FeatureCategory.Page, featureLabeled)
      .then(() => {
        restoreDomHighlight(dom),
        clearOverlay(overlay);
      });
    }
    case CONTEXT_MENU_IDS.LABEL_CLEAR_ALL: {
      restoreDomHighlight(dom);
      clearOverlay(overlay);
      return Promise.resolve(true);
    }
    default:
      break;
  }
}