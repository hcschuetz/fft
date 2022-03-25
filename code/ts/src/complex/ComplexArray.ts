import { Complex } from "./Complex";

// Putting real parts and complex parts into separate Float64Arrays seems to be
// slightly faster than a single Float64Array (with either interleaved real and
// complex parts or with real and complex parts going to the first and second
// half, respectively).

// The two arrays are expected to be of equal size.
export type ComplexArray = {res: Float64Array, ims: Float64Array};

export const makeComplexArray = (n: number): ComplexArray => ({
  res: new Float64Array(n),
  ims: new Float64Array(n),
});

export const getComplex = ({res, ims}: ComplexArray, i: number): Complex =>
  ({re: res[i], im: ims[i]});

export const setComplex = ({res, ims}: ComplexArray, i: number, {re, im}: Complex): void => {
  res[i] = re;
  ims[i] = im;
}

export const complexArrayLength = (a: ComplexArray) => a.res.length;
