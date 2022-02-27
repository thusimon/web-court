import { MIN_ELEMENT_SIZE } from "@src/constants";

export const setupInputDoms = (parent: HTMLElement, type: string, count: number = 1) => {
  for (let i = 0; i < count; i++) {
    const input = document.createElement('input');
    input.type = type;
    //jsdom has bug, if not specified, the default opacity is empty string
    input.style.opacity = '0.8';
    //jsdom doesn't support getBoundingClientRect, need to mock it
    const randomRect = {
      top: Math.random(),
      left: Math.random(),
      width: Math.random() + MIN_ELEMENT_SIZE.WIDTH + 1,
      height: Math.random() + MIN_ELEMENT_SIZE.HEIGHT + 1
    };
    input.getBoundingClientRect = jest.fn().mockReturnValue({
      ...randomRect,
      ...{
        x: randomRect.left,
        y: randomRect.top,
        right: randomRect.left + randomRect.width,
        bottom: randomRect.top + randomRect.height
      }
    });
    parent.append(input);
  }
}
