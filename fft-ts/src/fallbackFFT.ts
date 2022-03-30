import { minus, plus } from "complex/dst/Complex.js";
import { ComplexArray, getComplex, setComplex } from "complex/dst/ComplexArray";

/**
 * Certain FFT optimizations assume a minimum problem size and do not work
 * correctly for small problems.  This is a fallback implementation for these
 * cases, so that the optimized implementations are correct for all inputs.
 */
export function fallbackFFT(n: number, f: ComplexArray, out: ComplexArray) {
  switch (n) {
    case 1: {
      setComplex(out, 0, getComplex(f, 0));
      return;
    }
    case 2: {
      const c0 = getComplex(f, 0);
      const c1 = getComplex(f, 1);
      setComplex(out, 0, plus(c0, c1));
      setComplex(out, 1, minus(c0, c1));
      return;
    }
    default: {
      throw new Error("fallbackFFT should only be called with sizes 1 or 2.");
    }
  }
}