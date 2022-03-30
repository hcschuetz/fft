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

  const permute = new Uint32Array(n);
  function preRecur(
    offset: number, fStride: number,
    out_offset: number,
    len: number
  ): void {
    if (len === 1) {
      permute[out_offset] = offset;
    } else {
      const doubleFStride = 2 * fStride;
      const halfLen = len / 2;
      const out_offset_odd = out_offset + halfLen;
      preRecur(offset          , doubleFStride, out_offset    , halfLen);
      preRecur(offset + fStride, doubleFStride, out_offset_odd, halfLen);
    }
  }
  preRecur(0, 1, 0, n);

  return function fft(f: ComplexArray, out: ComplexArray, direction: number = 1): void {
    for (let k = 0; k < n; k++) {
      setComplex(out, k, getComplex(f, permute[k]));
    }

    for (let len = 2; len <= n; len *= 2) {
      const fStride = n / len;
      const rStride = direction * fStride;
      const halfLen = len / 2;
      for (let out_offset = 0; out_offset < n; out_offset += len) {
        const out_offset_odd = out_offset + halfLen;
        for (let k = 0; k < halfLen; k++) {
          const e = getComplex(out, out_offset     + k);
          const o = getComplex(out, out_offset_odd + k);
          const rotated = times(o, getComplex(rotations, (n - k * rStride) % n));
          setComplex(out, out_offset     + k, plus (e, rotated));
          setComplex(out, out_offset_odd + k, minus(e, rotated));
        }
      }
    }
  }
}
