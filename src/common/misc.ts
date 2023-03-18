/**
 * @param rect 
 * @returns [centerX, centerY, width, height]
 */
export const getCenter = (rect: DOMRect): number[] => {
  return [
    rect.left + rect.width / 2,
    rect.top + rect.height / 2,
    rect.width,
    rect.height
  ];
};
