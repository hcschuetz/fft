import { minus, plus, times, expi } from "../complex/Complex.js";
import {
  ComplexArray,
  makeComplexArray,
  getComplex, setComplex,
} from "../complex/ComplexArray.js";


const TAU = 2 * Math.PI; // https://en.wikipedia.org/wiki/Turn_(angle)#Tau_proposals

export function fft_prepare(n: number) {
  const rotations = makeComplexArray(n);
  for (let k = 0; k < n; k++) {
    setComplex(rotations, k, expi(TAU * k / n));
  }
  return function fft(f: ComplexArray, direction: number = 1): ComplexArray {
    function recur(offset: number, fStride: number, len: number): ComplexArray {
      if (len === 1) {
        const out = makeComplexArray(1);
        setComplex(out, 0, getComplex(f, offset));
        return out;
      } else {
        const rStride = direction * fStride;
        const doubleFStride = 2 * fStride;
        const halfLen = len / 2;
        const even_out = recur(offset          , doubleFStride, halfLen);
        const odd_out  = recur(offset + fStride, doubleFStride, halfLen);
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
    return recur(0, 1, n);
  }
}
