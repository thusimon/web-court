import { mean, standardDeviation, min, max } from 'simple-statistics'
import { getGeoFeature } from './geo';

export type SpacialStatisticType = {
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

export type CountStatisticsType = {
  inputCount: number,
  usernameCount: number,
  passwordCount: number
}

export const getSpacialStatistics = (inputs: HTMLInputElement[]): SpacialStatisticType => {
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
    ux: mean(cxVec),
    uxP: mean(cxPVec),
    uy: mean(cyVec),
    uyP: mean(cyPVec),
    uwidth: mean(wVec),
    uwidthP: mean(wPVec),
    uheight: mean(hVec),
    uheightP: mean(hPVec),
    sx: standardDeviation(cxVec),
    sxP: standardDeviation(cxPVec),
    sy: standardDeviation(cyVec),
    syP: standardDeviation(cyPVec),
    swidth: standardDeviation(wVec),
    swidthP: standardDeviation(wPVec),
    sheight: standardDeviation(hVec),
    sheightP: standardDeviation(hPVec),
    rwidth: max(wVec) - min(wVec),
    rwidthP: max(wPVec) - min(wPVec),
    rheight: max(hVec) - min(hVec),
    rheightP: max(hPVec) - min(hPVec),
    minTop: min(cyVec),
    minTopP: min(cyPVec),
    minLeft: min(cxVec),
    minLeftP: min(cxPVec)
  };
};
