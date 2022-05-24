import { fft_prepare as fft01 } from "./fft01.js";
import { fft_prepare as fft02 } from "./fft02.js";
import { fft_prepare as fft03 } from "./fft03.js";
import { fft_prepare as fft04 } from "./fft04.js";
import { fft_prepare as fft05 } from "./fft05.js";
import { fft_prepare as fft06 } from "./fft06.js";
import { fft_prepare as fft07 } from "./fft07.js";
import { fft_prepare as fft08 } from "./fft08.js";
import { fft_prepare as fft09 } from "./fft09.js";
import { fft_prepare as fft10 } from "./fft10.js";
import { fft_prepare as fft11 } from "./fft11.js";
import { fft_prepare as fft12 } from "./fft12.js";
import { fft_prepare as fft13 } from "./fft13.js";
import { fft_prepare as fft14 } from "./fft14.js";
import { fft_prepare as fft14a } from "./fft14a.js";
import { fft_prepare as fft14b } from "./fft14b.js";
import { fft_prepare as fft15 } from "./fft15.js";
import { fft_prepare as fft15a } from "./fft15a.js";
import { fft_prepare as fft15b } from "./fft15b.js";
import { fft_prepare as fft15c } from "./fft15c.js";
import { fft_prepare as fft15d } from "./fft15d.js";
import { fft_prepare as fft16 } from "./fft16.js";
import { fft_prepare as fft40 } from "./fft40.js";
import { fft_prepare as fft44 } from "./fft44.js";
import { fft_prepare as fft47 } from "./fft47.js";
import { fft_prepare as fft98 } from "./fft98.js";
import { fft_prepare as fft98a } from "./fft98a.js";
import { fft_prepare as fft99 } from "./fft99.js";
import { fft_prepare as fft99a } from "./fft99a.js";
import { fft_prepare as fft99b } from "./fft99b.js";
import { fft_prepare as fft99c } from "./fft99c.js";
import { FFTFactory, FFT } from "fft-api/dst"
import { Complex } from "complex/dst/Complex.js";
import { FFTPrep, FFTRun } from "./fft_types.js";
import { ComplexArray, getComplex, makeComplexArray, setComplex } from "complex/dst/ComplexArray.js";

const fft_prepares: Record<string, FFTPrep> = {
  fft01,
  fft02,
  fft03,
  fft04,
  fft05,
  fft06,
  fft07,
  fft08,
  fft09,
  fft10,
  fft11,
  fft12,
  fft13,
  fft14,
  fft14a,
  fft14b,
  fft15,
  fft15a,
  fft15b,
  fft15c,
  fft15d,
  fft16,
  fft40,
  fft44,
  fft47,
  fft98,
  fft98a,
  fft99,
  fft99a,
  fft99b,
  fft99c,
}

class FFT_API implements FFT {
  input: ComplexArray;
  output: ComplexArray;
  fftRun: FFTRun;

  constructor(
    public readonly size: number,
    fft_prepare: FFTPrep,
  ) {
    this.input = makeComplexArray(size);
    this.output = makeComplexArray(size);
    this.fftRun = fft_prepare(size);
  }

  setInput(index: number, value: Complex): void {
    setComplex(this.input, index, value);
  }
  getInput(index: number): Complex {
    return getComplex(this.input, index);
  }
  run(direction?: number): void {
    this.fftRun(this.input, this.output, direction);
  }
  runBlock(nCalls: number, direction?: number): number {
    const start = performance.now();
    for (let i = 0; i < nCalls; i++) {
      this.fftRun(this.input, this.output, direction);
    }
    const end = performance.now();
    return (end - start) * 1e-3;
  }
  getOutput(index: number): Complex {
    return getComplex(this.output, index);
  }

  dispose(): void {
    // nothing to do; just rely on garbage collection
  }
}

export const versions: Record<string, FFTFactory> = Object.fromEntries(
  Object.entries(fft_prepares)
  .map(([name, fft_prepare]) => [name, (size: number) => new FFT_API(size, fft_prepare)])
);
