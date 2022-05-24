import { minus, plus, times, expi } from "complex/dst/Complex.js";
import {
  ComplexArray,
  makeComplexArray, complexArrayLength,
  getComplex, setComplex, copyComplexArray,
} from "complex/dst/ComplexArray.js";
import { FFTPrep } from "./fft_types.js";


const TAU = 2 * Math.PI; // https://en.wikipedia.org/wiki/Turn_(angle)#Tau_proposals

/**
 * Straight-forward (mostly unoptimized) FFT implementation.
 * Performs FFT with `direction === 1` (default) or IFFT with `direction === -1`.
 * The size of `f` must be a power of 2.
 */
export function fft(f: ComplexArray, direction: number = 1): ComplexArray {
  const len = complexArrayLength(f);
  if (len === 1) {
    return f;
  } else {
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
      const rotated = times(o, expi(-direction * TAU * k / len));
      setComplex(out, k          , plus (e, rotated));
      setComplex(out, k + halfLen, minus(e, rotated));
    }
    return out;
  }
}

// For compatibility with the other implementations:
export const fft_prepare: FFTPrep = (/* n */) => {
  return (f: ComplexArray, out: ComplexArray, direction: number = 1) =>
    copyComplexArray(fft(f, direction), out);
}
