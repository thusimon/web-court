/**
 * get spacial features, for one input, return
 * {
 *   top: x%
 *   left: x%
 *   width: x%
 *   height: x%
 *   nearestx: x%
 *   nearesty: x%  
 * }
 * @param inputs
 */
export type GeoSpacialType = {
  top: number;
  left: number;
  width: number;
  height: number;
  cx: number;
  cy: number;
  nearestx: number;
  nearesty: number;
}

export const getNomalizedRects = (inputs: HTMLInputElement[]): GeoSpacialType[] => {
  const bodyRect = document.body.getBoundingClientRect();
  if (bodyRect.height === 0 || bodyRect.width === 0) {
    console.warn('document body size = 0');
    return [];
  }
  return inputs.map(input => {
    const rect = input.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return {
      top: rect.top / bodyRect.height,
      left: rect.left / bodyRect.width,
      width: rect.width / bodyRect.width,
      height: rect.height / bodyRect.height,
      cx: cx / bodyRect.width,
      cy: cy / bodyRect.height,
      nearestx: 1,
      nearesty: 1
    }
  });
};

export const getNearestRect = (rect: GeoSpacialType, rects: GeoSpacialType[]): GeoSpacialType => {
  let nearestx = 1;
  let nearesty = 1;
  rects.forEach(r => {
    if (r === rect) {
      return;
    }
    const distX = r.cx - rect.cx;
    const distY = r.cy - rect.cy;
    nearestx = Math.abs(nearestx) > Math.abs(distX) ? distX : nearestx;
    nearesty = Math.abs(nearesty) > Math.abs(distY) ? distY : nearesty; 
  })
  rect.nearestx = nearestx;
  rect.nearesty = nearesty;
  return rect;
}
