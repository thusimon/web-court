import { MIN_INPUT_SIZE, MIN_INPUT_OPACITY } from  '../../constants';

export const findAllInputFields = (): HTMLInputElement[] => {
  const inputs = <HTMLCollectionOf<HTMLInputElement>>document.getElementsByTagName('INPUT');
  return Array.from(inputs);
}

export const findVisibleInputs = (): HTMLInputElement[] => {
  const inputs = findAllInputFields(); 
  return inputs.filter(input => {
    const inputRect = input.getBoundingClientRect();
    // filter by size, must be larger than 2x2
    if (inputRect.width <= MIN_INPUT_SIZE.WIDTH || inputRect.height <= MIN_INPUT_SIZE.HEIGHT) {
      return false;
    }
    // filter by styling
    const cssStyle = window.getComputedStyle(input);
    // opacity should be greater than 0.2
    const opacity = parseFloat(cssStyle.opacity)
    if (opacity < MIN_INPUT_OPACITY) {
      return false;
    }
    // display should not be none
    const display = cssStyle.display;
    if (display === 'none') {
      return false;
    }
    // visibility should not be hidden
    const visibility = cssStyle.visibility;
    if (visibility === 'hidden') {
      return false;
    }
    return true;
  });
}

export type DomAttributeType = {
  type: string;
  hasName: boolean,
  hasId: boolean,
  hasClass: boolean,
  hasText: boolean,
  disabled: boolean,
}

export const getDomAttribute = (inputs: HTMLInputElement[]): DomAttributeType[] => {
  return inputs.map(input => {
    return {
      type: input.type,
      hasName: !!input.name,
      hasId: !!input.id,
      hasClass: !!input.className,
      hasText: !!input.textContent.trim(),
      disabled: !!input.disabled
    }
  });
}

export const highLightPendingDom = (dom: HTMLElement) => {
  dom.style.setProperty('border', '2px solid red', 'important');
}

export const highLightLabeledDom = (dom: HTMLElement) => {
  dom.style.setProperty('border', '2px solid blue', 'important');
}
