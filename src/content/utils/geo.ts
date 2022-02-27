import { InputFieldType, INPUT_TYPE_NONE, PageInputMaxCount } from '../../constants';
import { findPasswordInputs, findUsernameInputs, findVisibleInputs, getInputType } from './dom';
import { toPrecision } from './numbers';
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
  typeNearestX?: string;
  typeNearestY?: string;
  distNearestX: number;
  distNearestY: number;
  distNearestXP: number;
  distNearestYP: number;
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
export const getGeoFeature = (element: HTMLElement): GeoType => {
  const bodyRect = document.body.getBoundingClientRect();
  const rect = element.getBoundingClientRect();
  if (bodyRect.height === 0 || bodyRect.width === 0) {
    console.log('document body size = 0');
    return {
      top: toPrecision(rect.top),
      topP: 1,
      left: toPrecision(rect.left),
      leftP:  1,
      width: toPrecision(rect.width),
      widthP: 1,
      height: toPrecision(rect.height),
      heightP: 1
    };
  }
  return {
    top: toPrecision(rect.top),
    topP: toPrecision(rect.top / bodyRect.height),
    left: toPrecision(rect.left),
    leftP: toPrecision(rect.left / bodyRect.width),
    width: toPrecision(rect.width),
    widthP: toPrecision(rect.width / bodyRect.width),
    height: toPrecision(rect.height),
    heightP: toPrecision(rect.height / bodyRect.height)
  }
};

export const getNearestInfo = (element: HTMLElement, inputs: HTMLInputElement[]): NearestType => {
  if (inputs.length === 0) {
    return {
      distNearestX: -20,
      distNearestY: -20,
      distNearestXP: -1,
      distNearestYP: -1
    };
  }
  let distNearestX = Number.MAX_SAFE_INTEGER;
  let distNearestY = Number.MAX_SAFE_INTEGER;
  let distNearestXP = 1;
  let distNearestYP = 1;
  const rect = getGeoFeature(element);
  const bodyRect = document.body.getBoundingClientRect();
  // filter the input out from the inputs
  inputs = inputs.filter(ipt => ipt != element);
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
      distNearestXP = bodyRect.width > 0 ? distNearestX / bodyRect.width : 1;
    }
    if (Math.abs(distY) < Math.abs(distNearestY)) {
      distNearestY = distY;
      distNearestYP = bodyRect.height > 0 ? distNearestY / bodyRect.height : 1;
    }
  });
  return {
    distNearestX: toPrecision(distNearestX),
    distNearestY: toPrecision(distNearestY),
    distNearestXP: toPrecision(distNearestXP),
    distNearestYP: toPrecision(distNearestYP)
  };
};

export const PaddingSpacialFeature: SpacialType = {
  xP: 0,
  yP: 1,
  wP: 0,
  hP: 0,
  type: InputFieldType.other
};

export const getUsernamePasswordGeoFeature = (visibleInputs: HTMLInputElement[]): SpacialType[] => {
  const usernameInputs = findUsernameInputs(visibleInputs);
  const passwordInputs = findPasswordInputs(visibleInputs);

  const usernameGeo = usernameInputs.map(input => getGeoFeature(input));
  const passwordGeo = passwordInputs.map(input => getGeoFeature(input));

  const usernameFeature = usernameGeo.map(geo => ({
    xP: toPrecision(geo.leftP),
    yP: toPrecision(geo.topP),
    wP: toPrecision(geo.widthP),
    hP: toPrecision(geo.heightP),
    type: InputFieldType.username
  }));

  const passwordFeature = passwordGeo.map(geo => ({
    xP: toPrecision(geo.leftP),
    yP: toPrecision(geo.topP),
    wP: toPrecision(geo.widthP),
    hP: toPrecision(geo.heightP),
    type: InputFieldType.password
  }));

  let allInputFeature: SpacialType[] = [];
  const allInputCount = usernameFeature.length + passwordFeature.length;
  if (allInputCount <= PageInputMaxCount) {
    allInputFeature = [...usernameFeature, ...passwordFeature]
      .concat(Array(PageInputMaxCount-allInputCount).fill(PaddingSpacialFeature));
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
  allInputFeature.sort((a, b) => a.yP - b.yP);
  return allInputFeature;
};
