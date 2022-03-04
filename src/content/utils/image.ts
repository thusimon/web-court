import { getMaxValueKey } from './statistics';
import { ImageDataCanvas } from '../../constants';

/**
 * @param imageData
 * return [r, g, b, a]
 */

export const rgbToName = (r: number, g: number, b: number) => {
  const rname = `0${r.toString(16)}`.slice(-2);
  const gname = `0${g.toString(16)}`.slice(-2);
  const bname = `0${b.toString(16)}`.slice(-2);
  return `${rname}${gname}${bname}`;
};

export const nameToRGB = (name: string): number[] => {
  const rname = name.substring(0, 2);
  const gname = name.substring(2, 4);
  const bname = name.substring(4, 6);
  return [
    parseInt(rname, 16),
    parseInt(gname, 16),
    parseInt(bname, 16)
  ];
};

export const getImageColorHist = (imageData: ImageDataCanvas) => {
  const colorSpace = imageData.colorSpace;
  const hist: {[key: string]: number} = {};
  if (colorSpace != 'srgb') {
    return hist;
  }
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    let colorName = '000000';
    if (a > 20) {
      // opacity is good
      colorName = rgbToName(r, g, b);
    }
    hist[colorName] = hist[colorName] ? hist[colorName] + 1 : 1;
  }
  return hist;
};

export const getDominateColor = (imageData: ImageDataCanvas): number[] => {
  const hist = getImageColorHist(imageData);
  const dominateColorName = getMaxValueKey(hist, '000000');
  return nameToRGB(dominateColorName);
};
