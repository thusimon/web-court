import { isNumber, isString } from "lodash";

export const toPrecision = (num: number, precision: number = 5) => {
  return parseFloat(num.toPrecision(precision));
}

export const parseToPixels = (input: any, def: string): string => {
  if (isNumber(input)) {
    return `${input}px`;
  }
  if (isString(input)) {
    return input;
  }
  return def;
}
