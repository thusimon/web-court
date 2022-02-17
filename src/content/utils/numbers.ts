export const toPrecision = (num: number, precision: number = 5) => {
  return parseFloat(num.toPrecision(precision));
}
