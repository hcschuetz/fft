import { fft_prepare as fft01 } from "./fft01";
import { fft_prepare as fft02 } from "./fft02";
import { fft_prepare as fft03 } from "./fft03";
import { fft_prepare as fft04 } from "./fft04";
import { fft_prepare as fft05 } from "./fft05";
import { fft_prepare as fft06 } from "./fft06";
import { fft_prepare as fft07 } from "./fft07";
import { fft_prepare as fft08 } from "./fft08";
import { fft_prepare as fft09 } from "./fft09";
import { fft_prepare as fft10 } from "./fft10";
import { fft_prepare as fft11 } from "./fft11";
import { fft_prepare as fft12 } from "./fft12";
import { fft_prepare as fft13 } from "./fft13";
import { fft_prepare as fft14 } from "./fft14";
import { fft_prepare as fft14a } from "./fft14a";
import { fft_prepare as fft14b } from "./fft14b";
import { fft_prepare as fft15 } from "./fft15";
import { fft_prepare as fft15a } from "./fft15a";
import { fft_prepare as fft15b } from "./fft15b";
import { fft_prepare as fft15c } from "./fft15c";
import { fft_prepare as fft15d } from "./fft15d";
import { fft_prepare as fft16 } from "./fft16";
import { fft_prepare as fft40 } from "./fft40";
import { fft_prepare as fft44 } from "./fft44";
import { fft_prepare as fft47 } from "./fft47";
import { fft_prepare as fft98 } from "./fft98";
import { fft_prepare as fft98a } from "./fft98a";
import { fft_prepare as fft99 } from "./fft99";
import { fft_prepare as fft99a } from "./fft99a";
import { fft_prepare as fft99b } from "./fft99b";
import { fft_prepare as fft99c } from "./fft99c";
import { FFTFactory, FFT } from "fft-api/dst"
import { Complex } from "complex/dst/Complex";
import { FFTPrep, FFTRun } from "./fft_types";
import { ComplexArray, getComplex, makeComplexArray, setComplex } from "complex/dst/ComplexArray";

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
  run(direction?: number): void {
    this.fftRun(this.input, this.output, direction);
  }
  getOutput(index: number): Complex {
    return getComplex(this.output, index);
  }
}

export const versions: Record<string, FFTFactory> = Object.fromEntries(
  Object.entries(fft_prepares)
  .map(([name, fft_prepare]) => [name, (size: number) => new FFT_API(size, fft_prepare)])
);
