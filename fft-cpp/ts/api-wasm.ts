import { Complex } from "complex/dst/Complex";
import { FFT, FFTFactory } from "fft-api/dst";
import decodeBase64 from "./decodeBase64";
import { versionNames } from "./info";
import { makeHeap } from "./makeHeap";

type API = {
  prepare_fft(n: number): number,
  run_fft(fft: number, input: number, output: number, direction: number): void,
  delete_fft(fft: number): void,

  malloc(size: number): number,
  free(p: number): void,
};

class FFTFromWASM implements FFT {
  private input: number;
  private output: number;
  private fft: number;
  private isDisposed: boolean = false;

  constructor(
    private readonly memory: WebAssembly.Memory,
    private readonly api: API,
    public readonly size: number,
  ) {
    this.input = api.malloc(size * 16);
    this.output = api.malloc(size * 16);
    this.fft = api.prepare_fft(size);
  }

  private checkDisposed() {
    if (this.isDisposed) {
      throw new Error("Trying to use disposed FFTFromWASM instance");
    }
  }

  setInput(i: number, value: Complex): void {
    this.checkDisposed();
    const dv = new DataView(this.memory.buffer);
    dv.setFloat64(this.input + 16 * i + 0, value.re, true);
    dv.setFloat64(this.input + 16 * i + 8, value.im, true);
  }
  getInput(i: number): Complex {
    this.checkDisposed();
    const dv = new DataView(this.memory.buffer);
    return {
      re: dv.getFloat64(this.input + 16 * i + 0, true),
      im: dv.getFloat64(this.input + 16 * i + 8, true),
    };  
  }
  run(direction: number = 1): void {
    this.checkDisposed();
    this.api.run_fft(this.fft, this.input, this.output, direction);
  }
  getOutput(i: number): Complex {
    this.checkDisposed();
    const dv = new DataView(this.memory.buffer);
    return {
      re: dv.getFloat64(this.output + 16 * i + 0, true),
      im: dv.getFloat64(this.output + 16 * i + 8, true),
    };
  }

  // TODO call this from the test-driver code
  dispose() {
    this.api.delete_fft(this.fft);
    this.api.free(this.input);
    this.api.free(this.output);
    this.isDisposed = true;
  }
}

export const versions: Record<string, () => Promise<FFTFactory>> =
  Object.fromEntries(
    versionNames
    .filter(name => name !== "fftKiss2") // TODO make fftKiss2 work again
    .map(name => {
      async function makeFactoryPromise(): Promise<FFTFactory> {
        try {
          const imported = await import(`../dst-wasm/${name}-wasm.js`);
          const base64_version = imported.default;
          const bytes = decodeBase64(base64_version);

          const memory = new WebAssembly.Memory({initial: 0, maximum: 100});
          // ad-hoc value (should suffice for the data on the stack);
          // actually only needed for certain implementations (fft01, fft02)
          const stackSize = 2000000;
          const heap = makeHeap(memory, stackSize, {shouldSelfCheck: "quiet"});

          // Our C/C++ code needs only a small runtime environment.
          const imports: WebAssembly.Imports = {
            env: {
              ...heap,
              // TODO use heap management from a (C/C++) library?
              // but continue to use cos, sin from JS;
              // (not sure about memset; probably from C lib)
              _Znwm: heap.malloc, // new
              _Znam: heap.malloc, // new[]
              _ZdlPv: heap.free,  // delete
              cos: Math.cos,
              sin: Math.sin,
              __stack_pointer: new WebAssembly.Global({value: 'i32', mutable: true}, stackSize),
            },
          };

          const { instance } = await WebAssembly.instantiate(bytes, imports);
          (instance.exports as any).__wasm_call_ctors?.();
          const api: API = {...instance.exports as any, ...heap};
          return (size: number): FFT => new FFTFromWASM(memory, api, size);
        } catch (e) {
          console.error("Problem while setting up WASM instance:", e);
          // debugger;
          throw e;
        }
      }
      return [name, makeFactoryPromise];
    })
  );
