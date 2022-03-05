import { GeneralFeatureLabeled } from "./content/utils/storage";
import { ActivationIdentifier } from '@tensorflow/tfjs-layers/dist/keras_format/activation_config';

export const WEBCOURT_UID = 'SrElXAlR4zOvfv8P';

export const MIN_ELEMENT_SIZE = {
  WIDTH: 5,
  HEIGHT: 5
};

export const MIN_ELEMENT_OPACITY = 0.2;

export const INPUT_TYPE_NONE = 'NONE';

export const CONTEXT_MENU_IDS = {
  LABEL_INPUT: 'LABEL_INPUT',
  LABEL_USERNAME: 'LABEL_USERNAME',
  LABEL_PASSWORD: 'LABEL_PASSWORD',
  LABEL_BUTTON: 'LABEL_BUTTON',
  LABEL_SUBMIT_OTHER: 'LABEL_SUBMIT_OTHER',
  LABEL_SUBMIT_ONLY: 'LABEL_SUBMIT_ONLY',
  LABEL_BUTTON_OTHER: 'LABEL_BUTTON_OTHER',
  LABEL_BUTTON_OTHER_ALL: 'LABEL_BUTTON_OTHER_ALL',
  LABEL_INPUT_OTHER: 'LABEL_INPUT_OTHER',
  LABEL_PAGE: 'LABEL_PAGE',
  LABEL_LOGIN: 'LABEL_LOGIN',
  LABEL_CHANGE_PASS: 'LABEL_CHANGE_PASS',
  LABEL_SIGNUP: 'LABEL_SIGNUP',
  LABEL_PAGE_OTHER: 'LABEL_PAGE_OTHER',
  LABEL_CLEAR_ALL: 'LABEL_CLEAR_ALL'
};

export enum OVERLAY_MODE {
  TOOLTIP,
  EMPTY
};

export const DEFAULT_OVERLAY_SETTINGS = {
  mode: OVERLAY_MODE.EMPTY,
  text: '',
  top: 0,
  left: 0
};

export enum MessageType {
  CONTEXT_CLICK
};

export interface Message {
  type: MessageType;
  action: string;
  data: object
};

export enum FieldLabelResult {
  username,
  password,
  submit,
  other
};

export enum PageLabelResult {
  login,
  change_pass,
  signup,
  other
};

export enum FeatureCategory {
  Inputs = 'Inputs',
  Page = 'Page',
  Buttons = 'Buttons'
};

export type FeaturesType = {
  [key in FeatureCategory]: GeneralFeatureLabeled[];
}

export enum InputFieldType {
  other,
  username,
  password,
  options,
  submit,
  time,
  values
};

export const PageInputMaxCount = 10; // collect 10 inputs at max 

export interface ModelLayer {
  units: number;
  activation: ActivationIdentifier;
};

export interface ModelConfig {
  name: string;
  config: ModelLayer[];
};

export interface ImageDataCanvas extends ImageData {
  colorSpace: string;
};
