import { MIN_ELEMENT_SIZE, MIN_ELEMENT_OPACITY, OVERLAY_MODE, InputFieldType, ImageDataCanvas } from  '../../constants';
import Overlay, { OverlaySettingsType } from '../components/overlay';
import html2canvas from 'html2canvas';
export interface DomAttributeType {
  type?: string;
  name?: string;
  id?: string;
  role?: string;
  value?: string;
  className?: string;
  textContent?: string;
  disabled?: boolean;
  tagName: string;
  tagDiscriptor: string; //this is only used to view the feature, should not be applied in training
};

export interface CSSPropertyType {
  textSecurity: string;
  fontFamily: string;
  borderRadius: number;
};

export const findAllInputFields = (): HTMLInputElement[] => {
  const inputs = <HTMLCollectionOf<HTMLInputElement>>document.getElementsByTagName('INPUT');
  return Array.from(inputs);
};

export const findAllButtons = (): HTMLElement[] => {
  const buttons = Array.from(document.getElementsByTagName('BUTTON')) as HTMLElement[];
  const inputSubmit = Array.from(document.getElementsByTagName('input')).filter(input => {
    return input.type === 'submit' || input.type === 'image' || input.type === 'button';
  }) as HTMLElement[];
  // TODO: think about how to get all the possible buttons but without getting too many
  // const links = Array.from(document.getElementsByTagName('A')) as HTMLElement[];
  return [
    ...buttons,
    ...inputSubmit
  ];
};

export const findAllVisibleElements = (elements: HTMLElement[]): HTMLElement[] => {
  return elements.filter(element => {
    const rect = element.getBoundingClientRect();
    // filter by size, must be larger than 2x2
    if (rect.width <= MIN_ELEMENT_SIZE.WIDTH || rect.height <= MIN_ELEMENT_SIZE.HEIGHT) {
      return false;
    }
    // filter by styling
    const cssStyle = window.getComputedStyle(element);
    // opacity should be greater than 0.2
    const opacity = parseFloat(cssStyle.opacity)
    if (opacity < MIN_ELEMENT_OPACITY) {
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

export const findVisibleInputs = (): HTMLInputElement[] => {
  const inputs = findAllInputFields() as HTMLElement[];
  return findAllVisibleElements(inputs) as HTMLInputElement[];
};

export const findVisibleButtons = (): HTMLElement[] => {
  // find all buttons
  const buttons = findAllButtons();
  return findAllVisibleElements(buttons);
};

export const inputHasPasswordStyling = (input: HTMLInputElement): boolean => {
  const cssStyle = getCSSProperties(input);
  if (cssStyle.textSecurity === 'disc' ||
    cssStyle.textSecurity === 'circle' ||
    cssStyle.textSecurity === 'square') {
    return true;
  }
  // font maybe customized
  if (cssStyle.fontFamily === 'text-security-disc' ||
    cssStyle.fontFamily === 'text-security-circle' ||
    cssStyle.fontFamily === 'text-security-square') {
    return true;
  }
  return false;
}

export const getInputType = (input: HTMLInputElement): InputFieldType => {
  const type = input.type;
  if (type === 'password') {
    return InputFieldType.password;
  } else if (type === 'text' || type === 'email' || type === 'tel' || type === 'search') {
    if (inputHasPasswordStyling(input)) {
      return InputFieldType.password;
    } else {
      return InputFieldType.username;
    }
  } else if (type === 'button' || type === 'submit' || type === 'image') {
    return InputFieldType.submit;
  } else if (type === 'checkbox' || type === 'radio') {
    return InputFieldType.options;
  } else if (type === 'date' || type === 'datetime-local' || type === 'month' || type === 'week' || type === 'time') {
    return InputFieldType.time;
  } else if (type === 'range' || type === 'number') {
    return InputFieldType.values;
  } else {
    return InputFieldType.other;
  }
};

export const findUsernameInputs = (inputs: HTMLInputElement[]): HTMLInputElement[] => {
  return inputs.filter(input => getInputType(input) == InputFieldType.username);
};

export const findPasswordInputs = (inputs: HTMLInputElement[]): HTMLInputElement[] => {
  return inputs.filter(input => getInputType(input) == InputFieldType.password);
};

export const getDomAttributes = (element: HTMLElement): DomAttributeType => {
  const domAttributes: DomAttributeType = {
    type: element.getAttribute('type'),
    name: element.getAttribute('name'),
    role: element.getAttribute('role'),
    id: element.id,
    className: element.className,
    textContent: getAllTextContent(element),
    disabled: !!element.hasAttribute('disabled'),
    tagName: element.tagName.toLocaleLowerCase(),
    tagDiscriptor: getTagDescriptor(element)
  }
  if (element instanceof HTMLInputElement) {
    domAttributes.value = element.value;
  } else {
    domAttributes.value = null;
  }
  return domAttributes;
};

export const getAllTextContent = (element: HTMLElement): string => {
  let textContent = '';
  if (element.textContent) {
    textContent += element.textContent;
  }
  if (element instanceof HTMLInputElement && element.value) {
    textContent += element.value;
  }
  if (textContent) {
    return textContent;
  } else {
    const children = element.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      textContent += getAllTextContent(child);
    }
    return textContent;
  }
}

export const getCSSProperties = (element: HTMLElement): CSSPropertyType => {
  const cssStyle = window.getComputedStyle(element);
  const textSecurity = cssStyle.getPropertyValue('-webkit-text-security');
  const fontFamily = cssStyle.getPropertyValue('font-family');
  const borderRadius = parseFloat(cssStyle.getPropertyValue('border-radius'));
  return {
    textSecurity,
    fontFamily,
    borderRadius,
  };
};

export const getCanvasImageData = async (element: HTMLElement): Promise<ImageDataCanvas> => {
  const canvas = await html2canvas(element);
  const context = canvas.getContext('2d');
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height) as ImageDataCanvas;
  return imageData;
}

export const highlightLabeledDoms = (doms: HTMLElement[], color: string) => {
  if (!doms) {
    return;
  }
  doms.forEach(dom => dom.style.setProperty('border', `1px solid ${color}`, 'important'));
};

export const restoreDomHighlight = (doms: HTMLElement[]) => {
  if (!doms) {
    return;
  }
  doms.forEach(dom => dom.style.removeProperty('border'));
};

export const getTagDescriptor = (dom: HTMLElement) => {
  const tagStr = dom.tagName.toLocaleLowerCase();
  const idStr = dom.id ? `#${dom.id}` : '';
  const classStr = typeof dom.className === 'string' ? `.${dom.className.split(' ').join('.')}` : '';
  return `${tagStr}${idStr}${classStr}`;
};

let positionTimer: ReturnType<typeof setInterval>;
export const addTooltipUnderDom = (dom: HTMLElement, overlay: Overlay) => {
  if (positionTimer) {
    clearInterval(positionTimer);
  }
  positionTimer = setInterval(() => {
    const domRect = dom.getBoundingClientRect();
    const overlayRect = overlay.getBoundingClientRect();
    const overlaySettings: OverlaySettingsType = {
      top: domRect.top - overlayRect.top + domRect.height + 5,
      left: domRect.left - overlayRect.left,
      mode: OVERLAY_MODE.TOOLTIP,
      text: getTagDescriptor(dom)
    }
    overlay.updateSettings(overlaySettings);
  }, 200);
};

export const clearOverlay = (overlay: Overlay) => {
  if (positionTimer) {
    clearInterval(positionTimer);
  }
  overlay.clear();
};
