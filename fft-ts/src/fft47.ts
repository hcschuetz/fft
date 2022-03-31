import { minus, plus, times, rot90, Complex, timesScalar } from "complex/dst/Complex";
import { ComplexArray, getComplex, makeComplexArray, setComplex } from "complex/dst/ComplexArray";
import { fallbackFFT } from "./fallbackFFT";
import { FFTPrep } from "./fft_types";


const TAU = 2 * Math.PI; // https://en.wikipedia.org/wiki/Turn_(angle)#Tau_proposals

export const fft_prepare: FFTPrep = n => {
  const cosines = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    cosines[i] = Math.cos(TAU * i / n);
  }

  const quarterN = n >>> 2;
  const permute = new Uint32Array(quarterN);
  for (let len = quarterN, fStride = 1; len > 1; len >>>= 1, fStride <<= 1) {
    const halfLen = len >>> 1;
    for (let out_offset = 0; out_offset < quarterN; out_offset += len) {
      const limit = out_offset + len;
      for (let out_offset_odd = out_offset + halfLen; out_offset_odd < limit; out_offset_odd++) {
        permute[out_offset_odd] += fStride;
      }
    }
  }

  return function fft(f: ComplexArray, out: ComplexArray, direction: number = 1): void {
    if (n <= 2) return fallbackFFT(n, f, out);

    const nMask = n - 1;
    const negDirection = -direction;

    const rotation = (x: number): Complex => ({
      re: cosines[x & nMask],
      im: cosines[(quarterN - x) & nMask]
    })

    for (let out_offset = 0; out_offset < n;) {
      let offset = permute[out_offset >> 2];
      const b0 = getComplex(f, offset); offset += quarterN;
      const b2 = getComplex(f, offset); offset += quarterN;
      const b1 = getComplex(f, offset); offset += quarterN;
      const b3 = getComplex(f, offset);

      const c0 =                   plus (b0, b1);
      const c1 =                   minus(b0, b1);
      const c2 =                   plus (b2, b3);
      const c3 = timesScalar(rot90(minus(b2, b3)), negDirection);

      setComplex(out, out_offset++, plus (c0, c2));
      setComplex(out, out_offset++, plus (c1, c3));
      setComplex(out, out_offset++, minus(c0, c2));
      setComplex(out, out_offset++, minus(c1, c3));
    }

    let len = 8, rStride = direction * (n >>> 3);
    for (; len < n; len <<= 2, rStride >>= 2) {
      const halfLen = len >> 1;
      {
        for (let out_offset = 0; out_offset < n;) {
          const i0 = out_offset; out_offset += halfLen;
          const i1 = out_offset; out_offset += halfLen;
          const i2 = out_offset; out_offset += halfLen;
          const i3 = out_offset; out_offset += halfLen;
  
          const b0 = getComplex(out, i0);
          const b1 = getComplex(out, i1);
          const b2 = getComplex(out, i2);
          const b3 = getComplex(out, i3);
  
          const c0 =                   plus (b0, b1);
          const c1 =                   minus(b0, b1);
          const c2 =                   plus (b2, b3);
          const c3 = timesScalar(rot90(minus(b2, b3)), negDirection);
  
          setComplex(out, i0, plus (c0, c2));
          setComplex(out, i1, plus (c1, c3));
          setComplex(out, i2, minus(c0, c2));
          setComplex(out, i3, minus(c1, c3));
        }
      }
      const rStride1 = rStride >> 1;
      const rStride2 = rStride;
      const rStride3 = rStride2 + rStride1;
      let rOffset1 = -rStride1;
      let rOffset2 = -rStride2;
      let rOffset3 = -rStride3;
      for (let k = 1; k < halfLen; k++) {
        // TODO Some bit fiddling with rOffset[123] to restrict cosine lookups
        // to the first quadrant?  Then shorten the cosines array.
        const r1 = rotation(rOffset1); rOffset1 -= rStride1;
        const r2 = rotation(rOffset2); rOffset2 -= rStride2;
        const r3 = rotation(rOffset3); rOffset3 -= rStride3;
        for (let out_offset = k; out_offset < n;) {
          const i0 = out_offset; out_offset += halfLen;
          const i1 = out_offset; out_offset += halfLen;
          const i2 = out_offset; out_offset += halfLen;
          const i3 = out_offset; out_offset += halfLen;

          const b0 =       getComplex(out, i0)     ;
          const b1 = times(getComplex(out, i1), r2);
          const b2 = times(getComplex(out, i2), r1);
          const b3 = times(getComplex(out, i3), r3);

          const c0 =                   plus (b0, b1);
          const c1 =                   minus(b0, b1);
          const c2 =                   plus (b2, b3);
          const c3 = timesScalar(rot90(minus(b2, b3)), negDirection);

          setComplex(out, i0, plus (c0, c2));
          setComplex(out, i1, plus (c1, c3));
          setComplex(out, i2, minus(c0, c2));
          setComplex(out, i3, minus(c1, c3));
        }
      }
    }
    if (len === n) {
      // If we come here, n is not a power of 4 (but still a power of 2).
      // So we need to run one extra round of 2-way butterflies.
      const halfLen = len >>> 1;

      // TODO Roll this back into the following loop?
      // Saving a single complex multiplicatin is probably not worth the extra code.
      {
        const z0 = getComplex(out, 0);
        const z1 = getComplex(out, halfLen);

        setComplex(out, 0      , plus (z0, z1));
        setComplex(out, halfLen, minus(z0, z1));
      }
      let rOffset = -rStride;
      for (let k0 = 1, k1 = halfLen + 1; k0 < halfLen; k0++, k1++) {
        const r = rotation(rOffset); rOffset -= rStride;

        const z0 =       getComplex(out, k0);
        const z1 = times(getComplex(out, k1), r);

        setComplex(out, k0, plus (z0, z1));
        setComplex(out, k1, minus(z0, z1));
      }
    }
  }
}
