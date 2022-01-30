import { mean, standardDeviation } from 'simple-statistics'
import { GeoType } from "./geo";

export type SpacialStatisticType = {
  ux: number; // mean of x
  uxP: number;
  uy: number; // mean of y
  uyP: number;
  sx: number; // standard variance of x
  sxP: number;
  sy: number; // standard variance of y
  syP: number;
};

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
};

export const getDomStatistics = () => {
  const forms = document.getElementsByTagName('FORM');
  const inputs = document.getElementsByTagName('INPUT');
};
  