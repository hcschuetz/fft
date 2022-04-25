import { Complex } from "complex/dst/Complex";
import { FFT, FFTFactory } from "fft-api/dst";
import decodeBase64 from "./decodeBase64";
import { versionNames } from "./info";

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
    this.isDisposed = false;
    this.api.delete_fft(this.fft);
    this.api.free(this.input);
    this.api.free(this.output);
  }
}

export const versions: Record<string, () => Promise<FFTFactory>> =
  Object.fromEntries(
    versionNames.map(name => {
      async function makeFactoryPromise(): Promise<FFTFactory> {
        try {
          const imported = await import(`../dst-wasm/${name}-wasm.js`);
          const base64_version = imported.default;
          const bytes = decodeBase64(base64_version);

          // My definitions of `memory` and `imports` are a result of trial and error.
          // TODO Find the appropriate documentation and check if this makes sense.
          const memory = new WebAssembly.Memory({initial: 256, maximum: 256})
          const imports: WebAssembly.Imports = {
            wasi_snapshot_preview1: {
              proc_exit() {
                console.error("proc_exit() should never be called. Arguments:", arguments);
              },
            },
            env: {
              __stack_pointer: new WebAssembly.Global({value:'i32', mutable: true}, 1 << 20),
              __memory_base: 0,
              __table_base: 0,
              memory,
              // The initial value (size?) is just a guess after instantiation has complained
              // about too small numbers.
              __indirect_function_table: new WebAssembly.Table({initial: 100, element: 'anyfunc'}),
            },
            "GOT.mem": {
              __heap_base: new WebAssembly.Global({value:'i32', mutable: true}, 1 << 20),
            },
          };

          const { instance } = await WebAssembly.instantiate(bytes, imports);
          return (size: number): FFT =>
            new FFTFromWASM(memory, instance.exports as API, size);
        } catch (e) {
          console.error("Problem while setting up WASM instance:", e);
          // debugger;
          throw e;
        }
      }
      return [name, makeFactoryPromise];
    })
  );
