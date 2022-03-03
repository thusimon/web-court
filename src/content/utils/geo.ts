import { InputFieldType, INPUT_TYPE_NONE, PageInputMaxCount } from '../../constants';
import { findPasswordInputs, findUsernameInputs, findVisibleInputs, getInputType } from './dom';
import { toPrecision } from './numbers';
export interface GeoType {
  top: number;
  topP?: number;
  left: number;
  leftP?: number;
  width: number;
  widthP?: number;
  height: number;
  heightP?: number
};

export interface GeoPrefixType {
  [key: string]: number;
}

export interface NearestType {
  typeNearestX?: string;
  typeNearestY?: string;
  distNearestX: number;
  distNearestY: number;
  distNearestXP?: number;
  distNearestYP?: number;
};

export interface SpacialType {
  xP: number; // coordinate x percentage
  yP: number; // coordinate y percentage
  wP: number; // width percentage
  hP: number; // height percentage
  type: InputFieldType; // it is username input or password input
}

export const addKeyPrefix = (key: string, prefix: string = '') => `${prefix}${key}`;

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
export const getGeoFeature = (element: HTMLElement, useRatio: boolean = true, keyPrefix: string = ''): GeoPrefixType => {
  if (!element) {
    const geo = {
      [addKeyPrefix('top', keyPrefix)]: 0,
      [addKeyPrefix('left', keyPrefix)]: 0,
      [addKeyPrefix('width', keyPrefix)]: 0,
      [addKeyPrefix('height', keyPrefix)]: 0
    }
    return useRatio ? {
      ...geo,
      ...{
        [addKeyPrefix('topP', keyPrefix)]: 0,
        [addKeyPrefix('leftP', keyPrefix)]: 0,
        [addKeyPrefix('widthP', keyPrefix)]: 0,
        [addKeyPrefix('heightP', keyPrefix)]: 0
      }
    } : geo;
  }
  const bodyRect = document.body.getBoundingClientRect();
  const rect = element.getBoundingClientRect();
  const geo = {
    [addKeyPrefix('top', keyPrefix)]: toPrecision(rect.top),
    [addKeyPrefix('left', keyPrefix)]: toPrecision(rect.left),
    [addKeyPrefix('width', keyPrefix)]: toPrecision(rect.width),
    [addKeyPrefix('height', keyPrefix)]: toPrecision(rect.height)
  }
  if (bodyRect.height === 0 || bodyRect.width === 0) {
    console.log('document body size = 0');
    const geoP = {
      [addKeyPrefix('topP', keyPrefix)]: 0,
      [addKeyPrefix('leftP', keyPrefix)]:  0,
      [addKeyPrefix('widthP', keyPrefix)]: 1,
      [addKeyPrefix('heightP', keyPrefix)]: 1
    }
    return useRatio ? {
      ...geo,
      ...geoP
    } : geo;
  }
  const geoP = {
    [addKeyPrefix('topP', keyPrefix)]: toPrecision(rect.top / bodyRect.height),
    [addKeyPrefix('leftP', keyPrefix)]: toPrecision(rect.left / bodyRect.width),
    [addKeyPrefix('widthP', keyPrefix)]: toPrecision(rect.width / bodyRect.width),
    [addKeyPrefix('heightP', keyPrefix)]: toPrecision(rect.height / bodyRect.height)
  }
  return useRatio ? {
    ...geo,
    ...geoP
  } : geo;
};

/**
 * get the sorted elements by distance on axis
 * by default on x-axis 
 * @param element
 * @param targets
 * @param axis
 */
export const sortElementsByDistanceOnAxis = (element: HTMLElement, targets: HTMLElement[], axis: number = 0): HTMLElement[] => {
  const rect = getGeoFeature(element);
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const sortedTargets = targets.sort((a, b) => {
    const rectA = getGeoFeature(a);
    const rectB = getGeoFeature(b);
    const centerXA = rectA.left + rectA.width / 2;
    const centerYA = rectA.top + rectA.height / 2;
    const centerXB = rectB.left + rectB.width / 2;
    const centerYB = rectB.top + rectB.height / 2;
    if (axis == 0) {
      // sort by X axis
      const distXA = Math.abs(centerX - centerXA);
      const distXB = Math.abs(centerX - centerXB);
      return distXA - distXB;
    } else if (axis == 1) {
      // sort by Y axis
      const distYA = Math.abs(centerY - centerYA);
      const distYB = Math.abs(centerY - centerYB);
      return distYA - distYB;
    } else {
      // sort by distance
      const distA = Math.sqrt(Math.pow(centerX - centerXA, 2) + Math.pow(centerY - centerYA, 2));
      const distB = Math.sqrt(Math.pow(centerX - centerXB, 2) + Math.pow(centerY - centerYB, 2));
      return distA - distB;
    }
  });
  return sortedTargets;
};

export const getNearestInfo = (element: HTMLElement, inputs: HTMLInputElement[]): NearestType => {
  if (inputs.length === 0) {
    return {
      distNearestX: -200,
      distNearestY: -200,
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
