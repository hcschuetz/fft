import { Complex } from "complex/dst/Complex";
import { ComplexArray, getComplex, makeComplexArray, setComplex } from "complex/dst/ComplexArray";
import { FFTPrep, FFTRun } from "fft-ts/dst/fft_types";

import mapObject from "./mapObject";
import { TestableFFT, TestableFFTFactory } from "./VersionContext";

import { fft_prepare as fft01 } from "fft-ts/dst/fft01";
import { fft_prepare as fft02 } from "fft-ts/dst/fft02";
import { fft_prepare as fft03 } from "fft-ts/dst/fft03";
import { fft_prepare as fft04 } from "fft-ts/dst/fft04";
import { fft_prepare as fft05 } from "fft-ts/dst/fft05";
import { fft_prepare as fft06 } from "fft-ts/dst/fft06";
import { fft_prepare as fft07 } from "fft-ts/dst/fft07";
import { fft_prepare as fft08 } from "fft-ts/dst/fft08";
import { fft_prepare as fft09 } from "fft-ts/dst/fft09";
import { fft_prepare as fft10 } from "fft-ts/dst/fft10";
import { fft_prepare as fft11 } from "fft-ts/dst/fft11";
import { fft_prepare as fft12 } from "fft-ts/dst/fft12";
import { fft_prepare as fft13 } from "fft-ts/dst/fft13";
import { fft_prepare as fft14 } from "fft-ts/dst/fft14";
import { fft_prepare as fft14a } from "fft-ts/dst/fft14a";
import { fft_prepare as fft14b } from "fft-ts/dst/fft14b";
import { fft_prepare as fft15 } from "fft-ts/dst/fft15";
import { fft_prepare as fft15a } from "fft-ts/dst/fft15a";
import { fft_prepare as fft15b } from "fft-ts/dst/fft15b";
import { fft_prepare as fft15c } from "fft-ts/dst/fft15c";
import { fft_prepare as fft15d } from "fft-ts/dst/fft15d";
import { fft_prepare as fft16 } from "fft-ts/dst/fft16";
import { fft_prepare as fft40 } from "fft-ts/dst/fft40";
import { fft_prepare as fft44 } from "fft-ts/dst/fft44";
import { fft_prepare as fft47 } from "fft-ts/dst/fft47";
import { fft_prepare as fft98 } from "fft-ts/dst/fft98";
import { fft_prepare as fft98a } from "fft-ts/dst/fft98a";
import { fft_prepare as fft99 } from "fft-ts/dst/fft99";
import { fft_prepare as fft99a } from "fft-ts/dst/fft99a";
import { fft_prepare as fft99b } from "fft-ts/dst/fft99b";
import { fft_prepare as fft99c } from "fft-ts/dst/fft99c";

export const versions: Record<string, FFTPrep> = {
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
};

class TestableFFTFromTS implements TestableFFT {
  private input: ComplexArray;
  private output: ComplexArray;
  private fftRun: FFTRun;

  constructor(
    fft_prepare: FFTPrep,
    public readonly size: number,
  ) {
    this.input = makeComplexArray(size);
    this.output = makeComplexArray(size);
    this.fftRun = fft_prepare(size);
  }

  setInput(i: number, value: Complex): void {
    setComplex(this.input, i, value);
  }
  run(direction: number = 1): void {
    this.fftRun(this.input, this.output, direction);
  }
  getOutput(i: number): Complex {
    return getComplex(this.output, i);
  }
}

export const testableVersions: Record<string, TestableFFTFactory> =
  mapObject(versions, fft_prep => n => new TestableFFTFromTS(fft_prep, n));
