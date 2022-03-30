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
  for (let len = n, fStride = 1; len > 1; len >>>= 1, fStride <<= 1) {
    const halfLen = len >>> 1;
    for (let out_offset = 0; out_offset < n; out_offset += len) {
      const limit = out_offset + len;
      for (let out_offset_odd = out_offset + halfLen; out_offset_odd < limit; out_offset_odd++) {
        permute[out_offset_odd] += fStride;
      }
    }
  }

  return function fft(f: ComplexArray, out: ComplexArray, direction: number = 1): void {
    for (let k = 0; k < n; k++) {
      setComplex(out, k, getComplex(f, permute[k]));
    }

    for (let len = 2, fStride = n >>> 1; len <= n; len <<= 1, fStride >>>= 1) {
      const rStride = direction * fStride;
      const halfLen = len >>> 1;
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
