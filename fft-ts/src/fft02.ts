import { minus, plus, times, expi } from "complex/dst/Complex.js";
import {
  ComplexArray,
  makeComplexArray, complexArrayLength,
  getComplex, setComplex, copyComplexArray,
} from "complex/dst/ComplexArray.js";
import { FFTPrep } from "./fft_types.js";


const TAU = 2 * Math.PI; // https://en.wikipedia.org/wiki/Turn_(angle)#Tau_proposals

// This is what we would normally export at this stage:
export function fft_prepare_raw(n: number) {
  const rotations = makeComplexArray(n);
  for (let k = 0; k < n; k++) {
    setComplex(rotations, k, expi(TAU * k / n));
  }
  return function fft(f: ComplexArray, direction: number = 1): ComplexArray {
    const len = complexArrayLength(f);
    if (len === 1) {
      return f;
    } else {
      const rStride = direction * n / len;
      const halfLen = len / 2;
      const even = makeComplexArray(halfLen);
      const odd  = makeComplexArray(halfLen);
      for (let k = 0; k < halfLen; k++) {
        setComplex(even, k, getComplex(f, 2 * k    ));
        setComplex(odd , k, getComplex(f, 2 * k + 1));
      }
      const even_out = fft(even, direction);
      const odd_out  = fft(odd , direction);
      const out = makeComplexArray(len);
      for (let k = 0; k < halfLen; k++) {
        const e = getComplex(even_out, k);
        const o = getComplex(odd_out , k);
        const rotated = times(o, getComplex(rotations, (n - k * rStride) % n));
        setComplex(out, k          , plus (e, rotated));
        setComplex(out, k + halfLen, minus(e, rotated));
      }
      return out;
    }
  }
}

// For compatibility with the other versions:
export const fft_prepare: FFTPrep = n => {
  const fft = fft_prepare_raw(n);
  return (f: ComplexArray, out: ComplexArray, direction: number = 1) =>
    copyComplexArray(fft(f, direction), out);
}
