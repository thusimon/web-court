import { InputFieldType, INPUT_TYPE_NONE, PageInputMaxCount } from '../../constants';
import { findPasswordInputs, findUsernameInputs, getInputType } from './dom';

export interface GeoType {
  top: number;
  topP: number;
  left: number;
  leftP: number;
  width: number;
  widthP: number;
  height: number;
  heightP: number
};

export interface NearestType {
  typeNearestX: string;
  typeNearestY: string;
  distNearestX: number;
  distNearestY: number;
};

export interface SpacialType {
  xP: number; // coordinate x percentage
  yP: number; // coordinate y percentage
  wP: number; // width percentage
  hP: number; // height percentage
  type: InputFieldType; // it is username input or password input
}

/**
 * get geometry features, for one input, return
 * {
 *   top: x
 *   topp: x%
 *   left: x
 *   leftp: x%
 *   width: x
 *   widthp: x%
 *   height: x
 *   heightp: x%
 * }
 * TODO: if input is in iframe, the geometry info should still base on top document
 * @param inputs
 */
export const getGeoFeature = (input: HTMLInputElement): GeoType => {
  const bodyRect = document.body.getBoundingClientRect();
  const rect = input.getBoundingClientRect();
  if (bodyRect.height === 0 || bodyRect.width === 0) {
    console.log('document body size = 0');
    return {
      top: rect.top,
      topP: 1,
      left: rect.left,
      leftP:  1,
      width: rect.width,
      widthP: 1,
      height: rect.height,
      heightP: 1
    };
  }
  return {
    top: rect.top,
    topP: rect.top / bodyRect.height,
    left: rect.left,
    leftP:  rect.left / bodyRect.width,
    width: rect.width,
    widthP: rect.width / bodyRect.width,
    height: rect.height,
    heightP: rect.height / bodyRect.height
  }
};

export const getNearestInfo = (input: HTMLInputElement, inputs: HTMLInputElement[]): NearestType => {
  let distNearestX = Number.MAX_SAFE_INTEGER;
  let distNearestY = Number.MAX_SAFE_INTEGER;
  let typeNearestX = INPUT_TYPE_NONE;
  let typeNearestY = INPUT_TYPE_NONE;
  const rect = getGeoFeature(input);
  // filter the input out from the inputs
  inputs = inputs.filter(ipt => ipt != input);
  const rects = inputs.map(ipt => getGeoFeature(ipt));
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  rects.forEach((r, i) => {
    const rcx = r.left + r.width / 2;
    const rcy = r.top + r.height / 2;
    // distance from rect to r
    // please note that the distance is directional
    // if distance > 0: the nearest input is on the RIGHT/BOTTOM of the target
    // if distance < 0: the nearest input is on the LEFT/TOP of the target
    const distX = rcx - cx;
    const distY = rcy - cy;
    if (Math.abs(distX) < Math.abs(distNearestX)) {
      distNearestX = distX;
      typeNearestX = !!inputs[i] ? inputs[i].type : INPUT_TYPE_NONE;
    }
    if (Math.abs(distY) < Math.abs(distNearestY)) {
      distNearestY = distY;
      typeNearestY = !!inputs[i] ? inputs[i].type : INPUT_TYPE_NONE;
    }
  });
  return {
    distNearestX,
    distNearestY,
    typeNearestX,
    typeNearestY
  };
};

export const PaddingSpacialFeature: SpacialType = {
  xP: 0,
  yP: 0,
  wP: 0,
  hP: 0,
  type: InputFieldType.other
};

export const getUsernamePasswordGeoVector = (inputs: HTMLInputElement[]): SpacialType[] => {
  const usernameInputs = findUsernameInputs(inputs);
  const passwordInputs = findPasswordInputs(inputs);

  const usernameGeo = usernameInputs.map(input => getGeoFeature(input));
  const passwordGeo = passwordInputs.map(input => getGeoFeature(input));

  const usernameFeature = usernameGeo.map(geo => ({
    xP: geo.leftP,
    yP: geo.topP,
    wP: geo.widthP,
    hP: geo.heightP,
    type: InputFieldType.username
  }));

  const passwordFeature = passwordGeo.map(geo => ({
    xP: geo.leftP,
    yP: geo.topP,
    wP: geo.widthP,
    hP: geo.heightP,
    type: InputFieldType.password
  }));

  let allInputFeature: SpacialType[] = [];
  const allInputCount = usernameFeature.length + passwordFeature.length;
  if (allInputCount <= PageInputMaxCount) {
    allInputFeature = [...usernameFeature, ...passwordFeature].concat(Array(PageInputMaxCount-allInputCount).fill(PaddingSpacialFeature));
  } else {
    // username + password input count is larger than 10, add each of them
    let inputAdded = 0;
    let usernameIdx = 0;
    let passwordIdx = 0;
    let featureIdx = 0
    while (inputAdded < PageInputMaxCount) {
      const username = usernameFeature[usernameIdx];
      const password = passwordFeature[passwordIdx];
      if (featureIdx % 2 == 0) {
        if (username) {
          allInputFeature.push(username);
          inputAdded++;
          usernameIdx++
        }
      } else {
        if (password) {
          allInputFeature.push(password);
          inputAdded++;
          passwordIdx++
        }
      }
      featureIdx++;
    }
  }

  // sort the inputs from top to bottom
  allInputFeature.sort(feature => feature.yP);
  return allInputFeature;
};
