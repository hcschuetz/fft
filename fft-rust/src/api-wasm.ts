import { Complex } from "complex/dst/Complex.js";
import { FFT, FFTFactory } from "fft-api/dst";
import decodeBase64 from "base64/dst/decodeBase64.js";
import { versionNames } from "./info.js";
import make_wasm_bindgen, { InitOutput } from "../dst/wrap-wasm.js";

class FFTFromWASM implements FFT {
  private input: number;
  private output: number;
  private fft: number;
  private isDisposed: boolean = false;

  constructor(
    private readonly api: InitOutput,
    public readonly size: number,
  ) {
    this.fft = api.fftapi_new(size);
    this.input = api.fftapi_input_start(this.fft);
    this.output = api.fftapi_output_start(this.fft);
  }

  private checkDisposed() {
    if (this.isDisposed) {
      throw new Error("Trying to use disposed FFTFromWASM instance");
    }
  }

  setInput(i: number, value: Complex): void {
    this.checkDisposed();
    // or just: this.api.fftapi_set_input(this.fft, i, value.re, value.im);
    const dv = new DataView(this.api.memory.buffer);
    dv.setFloat64(this.input + 16 * i + 0, value.re, true);
    dv.setFloat64(this.input + 16 * i + 8, value.im, true);
  }
  getInput(i: number): Complex {
    this.checkDisposed();
    const dv = new DataView(this.api.memory.buffer);
    return {
      re: dv.getFloat64(this.input + 16 * i + 0, true),
      im: dv.getFloat64(this.input + 16 * i + 8, true),
    };  
  }
  run(direction: number = 1): void {
    this.checkDisposed();
    this.api.fftapi_run(this.fft, direction);
  }
  runBlock(nCalls: number, direction: number = 1): number {
    const start = performance.now();
    for (let i = 0; i < nCalls; i++) {
      this.api.fftapi_run(this.fft, direction);
    }
    const end = performance.now();
    return (end - start) * 1e-3;
  }
  getOutput(i: number): Complex {
    this.checkDisposed();
    // or just:
    // return {
    //   re: this.api.fftapi_get_output_re,
    //   im: this.api.fftapi_get_output_im,
    // }
    const dv = new DataView(this.api.memory.buffer);
    return {
      re: dv.getFloat64(this.output + 16 * i + 0, true),
      im: dv.getFloat64(this.output + 16 * i + 8, true),
    };
  }

  // TODO call this from the test-driver code
  dispose() {
    this.checkDisposed();
    this.api.__wbg_fftapi_free(this.fft);
    this.isDisposed = true;
  }
}

export const versions: Record<string, () => Promise<FFTFactory>> =
  Object.fromEntries(
    versionNames
    .map(name => {
      async function makeFactoryPromise(): Promise<FFTFactory> {
        try {
          const imported = await import(`../dst/${name}-wasm.js`);
          const base64_version = imported.default;
          const bytes = decodeBase64(base64_version);
          const module = await WebAssembly.compile(bytes);
          const wasm_bindgen = make_wasm_bindgen();
          const exports = await wasm_bindgen(module);
          // Instead of the low-level exports we could use the higher-level API
          // which is in wasm_bindgen.FFTAPI.
          return (size: number): FFT => new FFTFromWASM(exports, size);
        } catch (e) {
          console.error("Problem while setting up WASM instance:", e);
          // debugger;
          throw e;
        }
      }
      return [name, makeFactoryPromise];
    })
  );
