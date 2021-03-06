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

    const nMask = n-1;

    for (let len = 2, rStride = (direction * n) >> 1; len <= n; len <<= 1, rStride >>= 1) {
      const halfLen = len >>> 1;
      let rOffset = 0;
      for (let k = 0; k < halfLen; k++) {
        const r = getComplex(rotations, rOffset & nMask); rOffset -= rStride;

        for (let out_offset = k; out_offset < n;) {
          const i0 = out_offset & nMask; out_offset += halfLen;
          const i1 = out_offset & nMask; out_offset += halfLen;

          const a0 = getComplex(out, i0);
          const a1 = getComplex(out, i1);

          const b0 = a0;
          const b1 = times(a1, r);

          const c0 = plus (b0, b1);
          const c1 = minus(b0, b1);

          setComplex(out, i0, c0);
          setComplex(out, i1, c1);
        }
      }
    }
  }
}
