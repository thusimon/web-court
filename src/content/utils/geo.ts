import { mean, standardDeviation } from 'simple-statistics'
import { INPUT_TYPE_NONE } from '../../constants';
export type GeoType = {
  top: number;
  topP: number;
  left: number;
  leftP: number;
  width: number;
  widthP: number;
  height: number;
  heightP: number
}

export type SpacialStatisticType = {
  ux: number; // mean of x
  uxP: number;
  uy: number; // mean of y
  uyP: number;
  sx: number; // standard variance of x
  sxP: number;
  sy: number; // standard variance of y
  syP: number;
}

export type NearestType = {
  typeNearestX: string;
  typeNearestY: string;
  distNearestX: number;
  distNearestY: number;
  idxNearestX: number;
  idxNearestY: number;
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
 * @param inputs
 */
export const getGeoFeatures = (inputs: HTMLInputElement[]): GeoType[] => {
  const bodyRect = document.body.getBoundingClientRect();
  if (bodyRect.height === 0 || bodyRect.width === 0) {
    console.log('document body size = 0');
    return inputs.map(input => {
      const rect = input.getBoundingClientRect();
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
    });
  }
  return inputs.map(input => {
    const rect = input.getBoundingClientRect();
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
  });
};

export const getNearestRectInfo = (rect: GeoType, rects: GeoType[]): NearestType => {
  let idxNearestX = -1;
  let idxNearestY = -1;
  let distNearestX = Number.MAX_SAFE_INTEGER;
  let distNearestY = Number.MAX_SAFE_INTEGER;
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  rects.forEach((r, i) => {
    if (r === rect) {
      return;
    }
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
      idxNearestX = i;
    }
    if (Math.abs(distY) < Math.abs(distNearestY)) {
      distNearestY = distY;
      idxNearestY = i;
    }
  });
  return {
    idxNearestX,
    idxNearestY,
    distNearestX,
    distNearestY,
    typeNearestX: INPUT_TYPE_NONE,
    typeNearestY: INPUT_TYPE_NONE
  };
}

export const getSpacialStatistics = (rects: GeoType[]): SpacialStatisticType => {
  if (rects.length === 0) {
    return {
      ux: 0,
      uxP: 0,
      uy: 0,
      uyP: 0,
      sx: 0,
      sxP: 0,
      sy: 0,
      syP: 0
    }
  }
  const cxVec = rects.map(r => r.left + r.width / 2);
  const cyVec = rects.map(r => r.top + r.height / 2);
  const cxPVec = rects.map(r => r.leftP + r.widthP / 2);
  const cyPVec = rects.map(r => r.topP + r.heightP / 2);
  return {
    ux: mean(cxVec),
    uxP: mean(cxPVec),
    uy: mean(cyVec),
    uyP: mean(cyPVec),
    sx: standardDeviation(cxVec),
    sxP: standardDeviation(cxPVec),
    sy: standardDeviation(cyVec),
    syP: standardDeviation(cyPVec)
  };
}
