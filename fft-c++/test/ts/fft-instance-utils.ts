import { abs2, Complex, minus, timesScalar } from "complex/dst/Complex";

const scalarType = "double";
const scalarSize = 8;
const complexSize = 2 * scalarSize;

export type Instance = {
  _malloc(s: number): number,
  _free(s: number): void,
  _prepare_fft(n: number): number,
  _delete_fft(s: number): void,
  _run_fft(fft: number, a0: number, a1: number, direction: number): void,
  getValue(p: number, type: "double"): number,
  setValue(p: number, val: number, type: "double"): void,
};

// --------------------------------------------------------------------------

// Some utilities similar to module "complex/dst/ComplexArray",
// but using "pseudo-native" memory of an instance

export class ComplexArray {
  p: number;

  constructor(
    public instance: Instance,
    public n: number,
  ) {
    this.p = instance._malloc(n * complexSize);
  }

  dispose(): void {
    this.instance._free(this.p);
  }
}

export const complexArrayLength = (a: ComplexArray): number => a.n;

export const getComplex = (a: ComplexArray, i: number): Complex => ({
  re: a.instance.getValue(a.p + complexSize * i             , scalarType),
  im: a.instance.getValue(a.p + complexSize * i + scalarSize, scalarType),
});

export const setComplex = (a: ComplexArray, i: number, {re, im}: Complex): void => {
  a.instance.setValue(a.p + i * complexSize             , re, scalarType);
  a.instance.setValue(a.p + i * complexSize + scalarSize, im, scalarType);
};

export const getDist = (a: ComplexArray, b: ComplexArray, scale_a: number = 1, scale_b: number = 1) => {
  const n = complexArrayLength(a);
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += abs2(minus(
      timesScalar(getComplex(a, i), scale_a),
      timesScalar(getComplex(b, i), scale_b),
    ));
  }
  return Math.sqrt(sum / n);
}

const randomScalar = () => Math.random();

export const randomComplex = () => ({
  re: randomScalar(),
  im: randomScalar(),
});

// --------------------------------------------------------------------------

export class FFT {
  p: number;

  constructor(
    public instance: Instance,
    public n: number,
  ) {
    this.p = instance._prepare_fft(n);
  }

  dispose(): void {
    this.instance._delete_fft(this.p);
  }

  run(f: ComplexArray, out: ComplexArray, direction: number = 1): void {
    if (f.instance !== this.instance || out.instance !== this.instance) {
      throw new Error("Cannot mix instances in FFT.run()");
    }
    this.instance._run_fft(this.p, f.p, out.p, direction);
  } 
}
