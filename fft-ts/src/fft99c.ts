import { Complex, minus, plus, times } from "complex/dst/Complex.js";
import { ComplexArray, getComplex, setComplex } from "complex/dst/ComplexArray.js";
import { fallbackFFT } from "./fallbackFFT.js";
import { FFTPrep } from "./fft_types.js";


const TAU = 2 * Math.PI; // https://en.wikipedia.org/wiki/Turn_(angle)#Tau_proposals

export const fft_prepare: FFTPrep = n => {
  const quarterN = n >> 2;
  const cosines = new Float64Array(quarterN + 1);
  for (let k = 0; k <= quarterN; k++) {
    cosines[k] = Math.cos(TAU * k / n);
  }

  const halfN = n >> 1;
  const permute =
    n <= (1 <<  8) ? new Uint8Array (halfN) :
    n <= (1 << 16) ? new Uint16Array(halfN) :
                     new Uint32Array(halfN);
  for (let len = halfN, fStride = 1; len > 1; len >>>= 1, fStride <<= 1) {
    const halfLen = len >>> 1;
    for (let out_offset = 0; out_offset < halfN; out_offset += len) {
      const limit = out_offset + len;
      for (let out_offset_odd = out_offset + halfLen; out_offset_odd < limit; out_offset_odd++) {
        permute[out_offset_odd] += fStride;
      }
    }
  }

  const precomputed = {n, cosines, permute};

  return function fft(f: ComplexArray, out: ComplexArray, direction: number = 1): void {
    const {n, cosines, permute} = precomputed;

    if (n < 2) return fallbackFFT(n, f, out);
  
    const halfN = n >>> 1;

    for (let out_offset = 0; out_offset < n;) {
      const i0 = permute[out_offset >> 1];
      const i1 = i0 + halfN;

      const z0 = getComplex(f, i0);
      const z1 = getComplex(f, i1);

      setComplex(out, out_offset++, plus (z0, z1));
      setComplex(out, out_offset++, minus(z0, z1));
    }

    for (let halfLen = 2, rStride = quarterN; rStride; halfLen <<= 1, rStride >>= 1) {
      const quarterLen = halfLen >> 1;
      for (let out_offset = 0; out_offset < n;) {
        const i0 = out_offset; out_offset += quarterLen;
        const i1 = out_offset; out_offset += quarterLen;
        const i2 = out_offset; out_offset += quarterLen;
        const i3 = out_offset; out_offset += quarterLen;

        const z0  = getComplex(out, i0);
        const z1  = getComplex(out, i1);
        const z2  = getComplex(out, i2);
        const aux = getComplex(out, i3);
        const z3: Complex = {re: direction * aux.im, im: -direction * aux.re};

        setComplex(out, i0, plus (z0, z2));
        setComplex(out, i1, plus (z1, z3));
        setComplex(out, i2, minus(z0, z2));
        setComplex(out, i3, minus(z1, z3));
      }
      let rOffset = quarterN;
      let k = 0;
      for (let limit = quarterLen; limit <= halfLen; limit += quarterLen) {
        k++; rOffset -= rStride; // skip the two cases simplified above
        for (; k < limit; k++) {
          // Performance hack relying on rOffset to fit in an int32.
          // It computes the sign of 0 as +1, but that's ok.
          const rSign = (rOffset >> 31) * 2 + 1;
          const rAbs = rSign * rOffset;
          const r: Complex = {
            re: (rSign * cosines[quarterN - rAbs]),
            im: -direction * cosines[rAbs],
          };
          rOffset -= rStride;

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
}
