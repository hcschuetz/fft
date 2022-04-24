import { Complex } from "complex/dst/Complex";
import { FFT, FFTFactory } from "fft-api/dst";

import { ComplexArray, FFT as FFTxxx, getComplex, Instance, setComplex } from "./fft-instance-utils";

import fft01 from "../dst-js/fft01";
import fft02 from "../dst-js/fft02";
import fft44 from "../dst-js/fft44";
import fft47 from "../dst-js/fft47";
import fft47pointers from "../dst-js/fft47pointers";
import fft48 from "../dst-js/fft48";
import fft60 from "../dst-js/fft60";
import fft99b from "../dst-js/fft99b";
import fft99c from "../dst-js/fft99c";
import fftKiss from "../dst-js/fftKiss";
import fftKiss2 from "../dst-js/fftKiss2";


const instanceFactories: Record<string, () => Promise<Instance>> = {
  fft01,
  fft02,
  fft44,
  fft47,
  fft47pointers,
  fft48,
  fft60,
  fft99b,
  fft99c,
  fftKiss,
  fftKiss2,
};

class FFTFromInstance implements FFT {
  private input: ComplexArray;
  private output: ComplexArray;
  private fft: FFTxxx;

  constructor(
    instance: Instance,
    public readonly size: number,
  ) {
    this.input = new ComplexArray(instance, size);
    this.output = new ComplexArray(instance, size);
    this.fft = new FFTxxx(instance, size);
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

export const versions: Record<string, Promise<FFTFactory>> =
  Object.fromEntries(
    Object.entries(instanceFactories).map(([name, instanceFactory]) => {
      async function makeFFTFactory(): Promise<FFTFactory> {
        // // Just to see if the handling of pending and rejected promises works:
        // if (name === "fft02") throw new Error("FOO BAR");
        // if (name === "fft44") await new Promise(resolve => setTimeout(resolve, 5000));
        const instance = await instanceFactory();
        return (size: number) => new FFTFromInstance(instance, size);
      }
      return [name, makeFFTFactory()];
    })
  );
    