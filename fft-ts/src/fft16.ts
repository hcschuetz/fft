import { Complex, minus, plus, times } from "complex/dst/Complex.js";
import { ComplexArray, getComplex, setComplex } from "complex/dst/ComplexArray.js";
import { FFTPrep } from "./fft_types.js";


const TAU = 2 * Math.PI; // https://en.wikipedia.org/wiki/Turn_(angle)#Tau_proposals

export const fft_prepare: FFTPrep = n => {
  const cosines = new Float64Array(n);
  for (let k = 0; k < n; k++) {
    cosines[k] = Math.cos(TAU * k / n);
  }

  const permute =
    n <= (1 <<  8) ? new Uint8Array (n) :
    n <= (1 << 16) ? new Uint16Array(n) :
                     new Uint32Array(n);
  for (let len = n, fStride = 1; len > 1; len >>>= 1, fStride <<= 1) {
    const halfLen = len >>> 1;
    for (let out_offset = 0; out_offset < n; out_offset += len) {
      const limit = out_offset + len;
      for (let out_offset_odd = out_offset + halfLen; out_offset_odd < limit; out_offset_odd++) {
        permute[out_offset_odd] += fStride;
      }
    }
  }

  const precomputed = {n, cosines, permute};

  return function fft(f: ComplexArray, out: ComplexArray, direction: number = 1): void {
    const {n, cosines, permute} = precomputed;

    for (let k = 0; k < n; k++) {
      setComplex(out, k, getComplex(f, permute[k]));
    }

    const nMask = n-1;
    const quarterN = n >>> 2;

    for (let halfLen = 1, rStride = n >> 1; halfLen < n; halfLen <<= 1, rStride >>= 1) {
      for (let out_offset = 0; out_offset < n;) {
        const i0 = out_offset; out_offset += halfLen;
        const i1 = out_offset; out_offset += halfLen;

        const z0 = getComplex(out, i0);
        const z1 = getComplex(out, i1);

        setComplex(out, i0, plus (z0, z1));
        setComplex(out, i1, minus(z0, z1));
      }
      let rOffset = -rStride;
      let rOffset1 = -quarterN - rStride;
      for (let k = 1; k < halfLen; k++) {
        const r: Complex = {
          re:             cosines[rOffset  & nMask],
          im: direction * cosines[rOffset1 & nMask],
        };
        rOffset  -= rStride;
        rOffset1 -= rStride;

        for (let out_offset = k; out_offset < n;) {
          const i0 = out_offset; out_offset += halfLen;
          const i1 = out_offset; out_offset += halfLen;

          const z0 =       getComplex(out, i0)    ;
          const z1 = times(getComplex(out, i1), r);

          setComplex(out, i0, plus (z0, z1));
          setComplex(out, i1, minus(z0, z1));
        }
      }
    }
  }
}
