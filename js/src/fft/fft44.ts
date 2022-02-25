import { minus, plus, times, expi, Complex } from "../complex/Complex.js";
import {
  ComplexArray,
  makeComplexArray,
  getComplex, setComplex,
} from "../complex/ComplexArray.js";


const TAU = 2 * Math.PI; // https://en.wikipedia.org/wiki/Turn_(angle)#Tau_proposals

export function fft_prepare(n: number, direction: number = 1) {
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

  return function fft(f: ComplexArray, out: ComplexArray): void {
    for (let k = 0; k < n; k++) {
      setComplex(out, k, getComplex(f, permute[k]));
    }

    // "& nMask" is like "% n", but sign-safe (always in {0, ..., n-1}).
    // It has a numeric purpose when applied to rOffset[123] wrapping
    // around rotations (actually negative values).
    // Applying it to out_offset just tells the compiler that i[0-3] are
    // actually 32-bit integers.  (Does this help or hurt?)
    const nMask = n-1;

    let len = 2, rStride = direction * (n >>> 1);
    for (; len < n; len <<= 2, rStride >>= 2) {
      const rStride1 = rStride >> 1;
      const rStride2 = rStride;
      const rStride3 = rStride2 + rStride1;
      let rOffset1 = 0;
      let rOffset2 = 0;
      let rOffset3 = 0;
      const halfLen = len >>> 1;
      for (let k = 0; k < halfLen; k++) {
        const r1 = getComplex(rotations, rOffset1 & nMask); rOffset1 -= rStride1;
        const r2 = getComplex(rotations, rOffset2 & nMask); rOffset2 -= rStride2;
        const r3 = getComplex(rotations, rOffset3 & nMask); rOffset3 -= rStride3;
        for (let out_offset = k; out_offset < n;) {
          const i0 = out_offset & nMask; out_offset += halfLen;
          const i1 = out_offset & nMask; out_offset += halfLen;
          const i2 = out_offset & nMask; out_offset += halfLen;
          const i3 = out_offset & nMask; out_offset += halfLen;

          const a0 = getComplex(out, i0);
          const a1 = getComplex(out, i1);
          const a2 = getComplex(out, i2);
          const a3 = getComplex(out, i3);

          const b0 =       a0;
          const b1 = times(a1, r2);
          const b2 = times(a2, r1);
          const b3 = times(a3, r3);

          const c0  = plus (b0, b1);
          const c1  = minus(b0, b1);
          const c2  = plus (b2, b3);
          const aux = minus(b2, b3);
          const c3: Complex = {
            re:  aux.im * direction,
            im: -aux.re * direction,
          };

          const d0 = plus (c0, c2);
          const d1 = plus (c1, c3);
          const d2 = minus(c0, c2);
          const d3 = minus(c1, c3);

          setComplex(out, i0, d0);
          setComplex(out, i1, d1);
          setComplex(out, i2, d2);
          setComplex(out, i3, d3);
        }
      }
    }
    if (len === n) {
      // If we come here, n is not a power of 4 (but still a power of 2).
      // So we need to run one extra round of 2-way butterflies.
      let rOffset = 0;
      const halfLen = len >>> 1;
      for (let k = 0, k1 = halfLen; k < halfLen; k++, k1++) {
        const r = getComplex(rotations, rOffset & nMask); rOffset -= rStride;

        const a0 = getComplex(out, k );
        const a1 = getComplex(out, k1);

        const b0 = a0;
        const b1 = times(a1, r);

        const c0 = plus (b0, b1);
        const c1 = minus(b0, b1);

        setComplex(out, k , c0);
        setComplex(out, k1, c1);
      }
    }
  }
}
