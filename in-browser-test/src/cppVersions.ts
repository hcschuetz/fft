import { ComplexArray, FFT, getComplex, Instance, setComplex } from "fft-cpp/dst/fft-instance-utils";
import { Complex } from "complex/dst/Complex";
import { TestableFFT, TestableFFTFactory } from "./VersionContext";
import mapObject from "./mapObject";

import fft01 from "fft-cpp/dst-js/fft01";
import fft02 from "fft-cpp/dst-js/fft02";
import fft44 from "fft-cpp/dst-js/fft44";
import fft47 from "fft-cpp/dst-js/fft47";
import fft47pointers from "fft-cpp/dst-js/fft47pointers";
import fft48 from "fft-cpp/dst-js/fft48";
import fft99b from "fft-cpp/dst-js/fft99b";
import fft99c from "fft-cpp/dst-js/fft99c";


export const factories: Record<string, () => Promise<Instance>> = {
  fft01,
  fft02,
  fft44,
  fft47,
  fft47pointers,
  fft48,
  fft99b,
  fft99c,
};

class TestableFFTFromInstance implements TestableFFT {
  private input: ComplexArray;
  private output: ComplexArray;
  private fft: FFT;

  constructor(
    instance: Instance,
    public readonly size: number,
  ) {
    this.input = new ComplexArray(instance, size);
    this.output = new ComplexArray(instance, size);
    this.fft = new FFT(instance, size);
  }

  setInput(i: number, value: Complex): void {
    setComplex(this.input, i, value);
  }
  run(direction: number = 1): void {
    this.fft.run(this.input, this.output, direction);
  }
  getOutput(i: number): Complex {
    return getComplex(this.output, i);
  }
}

export const testableCppVersions: Record<string, Promise<TestableFFTFactory>> =
  mapObject(factories, async (factory, name) => {
    // // Just to see if the handling of pending and rejected promises works:
    // if (name === "fft02") throw new Error("FOO BAR");
    // if (name === "fft44") await new Promise(resolve => setTimeout(resolve, 5000));
    const instance: Instance = await factory();
    const testableFFTFactory = (size: number): TestableFFT =>
      new TestableFFTFromInstance(instance, size);
    return testableFFTFactory;
  });
