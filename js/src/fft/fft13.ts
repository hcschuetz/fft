import { minus, plus, times, Complex } from "../complex/Complex.js";
import { ComplexArray, getComplex, setComplex } from "../complex/ComplexArray.js";


const TAU = 2 * Math.PI; // https://en.wikipedia.org/wiki/Turn_(angle)#Tau_proposals

function rotQ({re, im}: Complex, q: number): Complex {
  // switch (q & 3) {
  //   case 0: return {re:  re, im:  im};
  //   case 1: return {re: -im, im:  re};
  //   case 2: return {re: -re, im: -im};
  //   case 3: return {re:  im, im: -re};
  // }

  // let out = {re: .42, im: .42};
  // switch (q & 3) {
  //   case 0: out.re =  re; out.im =  im; break;
  //   case 1: out.re = -im; out.im =  re; break;
  //   case 2: out.re = -re; out.im = -im; break;
  //   case 3: out.re =  im; out.im = -re; break;
  // }
  // return out;

  // Bit-fiddling variant (avoids hard-to-predict jumps at the cost of a
  // complex multiplication)
  const s = 1.0 - (q & 2);
  return times({re: s * (~q & 1), im: s * ( q & 1)}, {re, im});

  // // Another bit-fiddling variant with fewer multiplications but array accesses
  // const q1 = q + 1;
  // const aux: [number, number] = [0.42, 0.42]; // or new Float64Array(2)
  // aux[q  & 1] = (1.0 - (q  & 2)) * re;
  // aux[q1 & 1] = (1.0 - (q1 & 2)) * im;
  // return {re: aux[0], im: aux[1]};
}

export function fft_prepare(n: number) {
  const quarterN = n >>> 2;
  const cosines = new Float64Array(quarterN + 1);
  for (let k = 0; k <= quarterN; k++) {
    cosines[k] = Math.cos(TAU * k / n);
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
    const quarterN = n >>> 2;
    const qNMask = quarterN-1;
    const logQN = Math.log2(quarterN) >> 0;

    for (let len = 2, rStride = (direction * n) >> 1; len <= n; len <<= 1, rStride >>= 1) {
      const halfLen = len >>> 1;
      let rOffset = 0;
      for (let k = 0; k < halfLen; k++) {
        // Some bit fiddling so that we only need to precompute cosines for the
        // first quadrant (not the full circle, no sines).
        // (Makes things less efficient in my benchmarks.)
        const hi = (rOffset & nMask) >> logQN;
        const lo = rOffset & qNMask;
        const r = rotQ({re: cosines[lo], im: cosines[quarterN - lo]}, hi);
        rOffset -= rStride;

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
