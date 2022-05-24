import { Complex, minus, plus, times } from "complex/dst/Complex.js";
import { ComplexArray, getComplex, setComplex } from "complex/dst/ComplexArray.js";
import { fallbackFFT } from "./fallbackFFT.js";
import { FFTPrep } from "./fft_types.js";


const TAU = 2 * Math.PI; // https://en.wikipedia.org/wiki/Turn_(angle)#Tau_proposals

export const fft_prepare: FFTPrep = n => {
  const half_n = n >> 1;
  const quarter_n = half_n >> 1;

  const permute = new Uint32Array(half_n);
  for (let s = quarter_n, t = 1; s; s >>= 1, t <<= 1) {
    for (let i = 0; i < half_n; i += 2*s) {
      const limit = i + 2*s;
      for (let j = i + s; j < limit; j++) {
        permute[j] += t;
      }
    }
  }

  const cosTable = new Float64Array(quarter_n + 1);
  // for (const i of cosTable.keys()) {
  for (let i = 0; i <= quarter_n; i++) {
    cosTable[i] = Math.cos(i/n * TAU);
  }

  return function fft(ps: ComplexArray, cs: ComplexArray, direction: number = 1) {
    if (n < 2) return fallbackFFT(n, ps, cs);
  
    for (let i = 0; i < n;) {
      const j = permute[i >> 1];
      const a = getComplex(ps, j         );
      const b = getComplex(ps, j + half_n);
      setComplex(cs, i++, plus (a, b));
      setComplex(cs, i++, minus(a, b));
    }

    for (let half_size = 2, tableStride = quarter_n; tableStride; half_size <<= 1, tableStride >>= 1) {
      for (let i = 0; i < n; i += 2 * half_size) {
        let j = i, k = i + half_size, r = -quarter_n;
        for (; r < 0; r += tableStride) {
          const a = getComplex(cs, j);
          const b = getComplex(cs, k);
          const rotation: Complex = {
            re: cosTable[quarter_n + r],
            im: -direction * cosTable[-r],
          };
          const b_rotated = times(rotation, b);
          setComplex(cs, j, plus (a, b_rotated));
          setComplex(cs, k, minus(a, b_rotated));
          j++; k++;
        }
        for (; r < quarter_n; r += tableStride) {
          const a = getComplex(cs, j);
          const b = getComplex(cs, k);
          const rotation: Complex = {
            re: -cosTable[quarter_n - r],
            im: -direction * cosTable[r],
          };
          const b_rotated = times(rotation, b);
          setComplex(cs, j, plus (a, b_rotated));
          setComplex(cs, k, minus(a, b_rotated));
          j++; k++;
        }
      }
    }
  }
}
