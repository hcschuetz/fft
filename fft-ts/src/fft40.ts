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

    const quarterTurn = 2*n - direction * n/4;
    let len = 2, fStride = n >>> 1;
    for (; len < n; len <<= 2, fStride >>>= 2) {
      const rStride = direction * fStride;
      const halfRStride = rStride >> 1;
      const halfLen = len >>> 1;
      const len2 = len << 1;
      for (let out_offset_ee = 0; out_offset_ee < n; out_offset_ee += len2) {
        const out_offset_eo = out_offset_ee + halfLen;
        const out_offset_oe = out_offset_ee + len;
        const out_offset_oo = out_offset_oe + halfLen; 
        for (let k = 0; k < halfLen; k++) {
          const r = getComplex(rotations, (n - k * rStride) % n);

          const ee =       getComplex(out, out_offset_ee + k);
          const eo = times(getComplex(out, out_offset_eo + k), r);
          const oe =       getComplex(out, out_offset_oe + k);
          const oo = times(getComplex(out, out_offset_oo + k), r);

          const ee1 =       plus (ee, eo);
          const eo1 =       minus(ee, eo);
          const oe1 = times(plus (oe, oo), getComplex(rotations, (n           - k * halfRStride) % n));
          const oo1 = times(minus(oe, oo), getComplex(rotations, (quarterTurn - k * halfRStride) % n));

          setComplex(out, out_offset_ee + k, plus (ee1, oe1));
          setComplex(out, out_offset_eo + k, plus (eo1, oo1));
          setComplex(out, out_offset_oe + k, minus(ee1, oe1));
          setComplex(out, out_offset_oo + k, minus(eo1, oo1));
        }
      }
    }
    if (len <= n) {
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
