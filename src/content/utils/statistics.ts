import { mean, standardDeviation, min, max } from 'simple-statistics'
import { GeneralFeature } from '../feature';
import { getGeoFeature } from './geo';

export interface SpacialStatisticType {
  ux: number; // mean of x
  uxP: number; // mean of x percentage
  uy: number; // mean of y
  uyP: number; // mean of y percentage
  uwidth: number; // mean of width
  uwidthP: number; // mean of width percentage
  uheight: number; // mean of height
  uheightP: number; // mean of height percentage
  sx: number; // standard variance of x
  sxP: number; // standard variance of x percentage
  sy: number; // standard variance of y
  syP: number; // standard variance of y percentage
  swidth: number; // standard variance of width
  swidthP: number; // standard variance of width percentage
  sheight: number; // standard variance of height
  sheightP: number; // standard variance of height percentage
  rwidth: number; // range of width
  rwidthP: number; // range of with percentage
  rheight: number; // range of height
  rheightP: number; // range of height percentage
  minTop: number; // topmost
  minTopP: number; // topmost percentage
  minLeft: number; // leftmost
  minLeftP: number; // leftmost percentage
};

export type SpacialStatisticKeyType = keyof SpacialStatisticType

export interface CountStatisticsType {
  inputCount: number;
  textCount: number;
  passwordCount: number;
}

export const getSpacialStatistics = (inputs: HTMLInputElement[]): GeneralFeature => {
  const rects = inputs.map(input => getGeoFeature(input));
  if (rects.length === 0) {
    return {
      ux: 0,
      uxP: 0,
      uy: 0,
      uyP: 0,
      uwidth: 0,
      uwidthP: 0,
      uheight: 0,
      uheightP: 0,
      sx: 0,
      sxP: 0,
      sy: 0,
      syP: 0,
      swidth: 0,
      swidthP: 0,
      sheight: 0,
      sheightP: 0,
      rwidth: 0,
      rwidthP: 0,
      rheight: 0,
      rheightP: 0,
      minTop: 0,
      minTopP: 0,
      minLeft: 0,
      minLeftP: 0
    }
  }
  const cxVec = rects.map(r => r.left + r.width / 2);
  const cyVec = rects.map(r => r.top + r.height / 2);
  const cxPVec = rects.map(r => r.leftP + r.widthP / 2);
  const cyPVec = rects.map(r => r.topP + r.heightP / 2);
  const wVec = rects.map(r => r.width);
  const wPVec = rects.map(r => r.widthP);
  const hVec = rects.map(r => r.height);
  const hPVec = rects.map(r => r.heightP);
  return {
    ux: mean(cxVec).toFixed(4),
    uxP: mean(cxPVec).toFixed(4),
    uy: mean(cyVec).toFixed(4),
    uyP: mean(cyPVec).toFixed(4),
    uwidth: mean(wVec).toFixed(4),
    uwidthP: mean(wPVec).toFixed(4),
    uheight: mean(hVec).toFixed(4),
    uheightP: mean(hPVec).toFixed(4),
    sx: standardDeviation(cxVec).toFixed(4),
    sxP: standardDeviation(cxPVec).toFixed(4),
    sy: standardDeviation(cyVec).toFixed(4),
    syP: standardDeviation(cyPVec).toFixed(4),
    swidth: standardDeviation(wVec).toFixed(4),
    swidthP: standardDeviation(wPVec).toFixed(4),
    sheight: standardDeviation(hVec).toFixed(4),
    sheightP: standardDeviation(hPVec).toFixed(4),
    rwidth: (max(wVec) - min(wVec)).toFixed(4),
    rwidthP: (max(wPVec) - min(wPVec)).toFixed(4),
    rheight: (max(hVec) - min(hVec)).toFixed(4),
    rheightP: (max(hPVec) - min(hPVec)).toFixed(4),
    minTop: min(cyVec).toFixed(4),
    minTopP: min(cyPVec).toFixed(4),
    minLeft: min(cxVec).toFixed(4),
    minLeftP: min(cxPVec).toFixed(4)
  };
};
