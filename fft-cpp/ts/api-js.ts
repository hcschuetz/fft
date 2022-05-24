import { Complex } from "complex/dst/Complex.js";
import { FFT, FFTFactory } from "fft-api/dst";
import { ComplexArray, getComplex, Instance, setComplex } from "./fft-instance-utils.js";
import { versionNames } from "./info.js";


class FFTFromInstance implements FFT {
  private input: ComplexArray;
  private output: ComplexArray;
  private p: number;

  constructor(
    private readonly instance: Instance,
    public readonly size: number,
  ) {
    this.input = new ComplexArray(instance, size);
    this.output = new ComplexArray(instance, size);
    this.p = instance._prepare_fft(size);
  }

  setInput(i: number, value: Complex): void {
    setComplex(this.input, i, value);
  }
  getInput(i: number): Complex {
    return getComplex(this.input, i);
  }
  run(direction: number = 1): void {
    this.instance._run_fft(this.p, this.input.p, this.output.p, direction);
  }
  runBlock(nCalls: number, direction: number = 1): number {
    const start = performance.now();
    for (let i = 0; i < nCalls; i++) {
      this.instance._run_fft(this.p, this.input.p, this.output.p, direction);
    }
    const end = performance.now();
    return (end - start) * 1e-3;
  }
  getOutput(i: number): Complex {
    return getComplex(this.output, i);
  }

  dispose() {
    // do nothing; just leave objects to garbage collection
  }
}

export const versions: Record<string, () => Promise<FFTFactory>> =
  Object.fromEntries(
    versionNames.map((name) => {
      async function makeFFTFactory(): Promise<FFTFactory> {
        // // Just to see if the handling of pending and rejected promises works:
        // if (name === "fft02") throw new Error("FOO BAR");
        // if (name === "fft44") await new Promise(resolve => setTimeout(resolve, 5000));
        const imported = await import(`../dst-js/${name}.js`);
        const factory = imported.default;
        const instance = await factory();
        return (size: number) => new FFTFromInstance(instance, size);
      }
      return [name, makeFFTFactory];
    })
  );
    