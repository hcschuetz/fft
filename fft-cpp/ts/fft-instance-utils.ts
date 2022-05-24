import { Complex } from "complex/dst/Complex.js";

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
// but using memory allocated by an instance

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
