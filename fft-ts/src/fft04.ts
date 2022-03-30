import { minus, plus, times, expi } from "complex/dst/Complex.js";
import {
  ComplexArray,
  makeComplexArray,
  getComplex, setComplex,
} from "complex/dst/ComplexArray.js";
import { FFTPrep } from "./fft_types.js";


const TAU = 2 * Math.PI; // https://en.wikipedia.org/wiki/Turn_(angle)#Tau_proposals

export const fft_prepare: FFTPrep = n => {
  const rotations = makeComplexArray(n);
  for (let k = 0; k < n; k++) {
    setComplex(rotations, k, expi(TAU * k / n));
  }
  return function fft(f: ComplexArray, out: ComplexArray, direction: number = 1): void {
    function recur(
      offset: number, fStride: number,
      out_offset: number,
      len: number
    ): void {
      if (len === 1) {
        setComplex(out, out_offset, getComplex(f, offset));
      } else {
        const rStride = direction * fStride;
        const doubleFStride = 2 * fStride;
        const halfLen = len / 2;
        const out_offset_odd = out_offset + halfLen;
        recur(offset          , doubleFStride, out_offset    , halfLen);
        recur(offset + fStride, doubleFStride, out_offset_odd, halfLen);
        for (let k = 0; k < halfLen; k++) {
          const e = getComplex(out, out_offset     + k);
          const o = getComplex(out, out_offset_odd + k);
          const rotated = times(o, getComplex(rotations, (n - k * rStride) % n));
          setComplex(out, out_offset     + k, plus (e, rotated));
          setComplex(out, out_offset_odd + k, minus(e, rotated));
        }
      }
    }
    recur(0, 1, 0, n);
  }
}
