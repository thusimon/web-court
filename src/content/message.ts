import { getInputFieldFeatures } from './feature';
import { addInputFeature } from './utils/storage';
import {
  highlightLabeledDom,
  restoreDomHighlight,
  clearOverlay
} from './utils/dom';
import { Message, CONTEXT_MENU_IDS, FieldLabelResult, PageLabelResult } from '../constants';
import Overlay from './components/overlay';

const contextMenuActions = [
  CONTEXT_MENU_IDS.LABEL_USERNAME,
  CONTEXT_MENU_IDS.LABEL_PASSWORD,
  CONTEXT_MENU_IDS.LABEL_SUBMIT,
  CONTEXT_MENU_IDS.LABEL_FIELD_UNKNOWN,
  CONTEXT_MENU_IDS.LABEL_LOGIN,
  CONTEXT_MENU_IDS.LABEL_CHANGE_PASS,
  CONTEXT_MENU_IDS.LABEL_SIGNUP,
  CONTEXT_MENU_IDS.LABEL_PAGE_UNKNOWN,
  CONTEXT_MENU_IDS.LABEL_CLEAR_ALL
]

export interface LabelData {
  url?: string;
  label?: FieldLabelResult | PageLabelResult 
};

export const handleLabel = (message: Message, input: HTMLElement, overlay: Overlay) => {
  if (!input) {
    return;
  }
  const action = message.action;
  const data = message.data as LabelData;
  if (!contextMenuActions.includes(action)) {
    return;
  }
  switch (action) {
    case CONTEXT_MENU_IDS.LABEL_USERNAME: {
      const inputFeatures = getInputFieldFeatures(input as HTMLInputElement);
      const featureLabled = {
        ...data,
        ...inputFeatures,
        label: FieldLabelResult.username
      }
      return addInputFeature(featureLabled)
      .then(() => {
        highlightLabeledDom(input);
      });
    }
    case CONTEXT_MENU_IDS.LABEL_PASSWORD: {
      const inputFeatures = getInputFieldFeatures(input as HTMLInputElement);
      const featureLabled = {
        ...data,
        ...inputFeatures,
        label: FieldLabelResult.password
      }
      return addInputFeature(featureLabled)
      .then(() => {
        highlightLabeledDom(input);
      });;
    }
    case CONTEXT_MENU_IDS.LABEL_SUBMIT: {
      return Promise.resolve(true);
    }
    case CONTEXT_MENU_IDS.LABEL_FIELD_UNKNOWN: {
      const inputFeatures = getInputFieldFeatures(input as HTMLInputElement);
      const featureLabled = {
        ...data,
        ...inputFeatures,
        label: FieldLabelResult.unknown
      }
      return addInputFeature(featureLabled)
      .then(() => {
        highlightLabeledDom(input);
      });;
    }
    case CONTEXT_MENU_IDS.LABEL_CLEAR_ALL: {
      restoreDomHighlight(input);
      clearOverlay(overlay);
      return Promise.resolve(true);
    }
    default:
      break;
  }
}