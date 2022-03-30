import { ComplexArray } from "complex/dst/ComplexArray";

export type FFTRun = (f: ComplexArray, out: ComplexArray, direction?: number) => void;
export type FFTPrep = (n: number) => FFTRun;
