import { TestableFFT, TestableFFTFactory } from "./VersionContext";
import decodeBase64 from "./decodeBase64";
import mapObject from "./mapObject";
import { Complex } from "complex/dst/Complex";

import fft01 from "fft-cpp/dst-wasm/fft01-wasm";
import fft02 from "fft-cpp/dst-wasm/fft02-wasm";
import fft44 from "fft-cpp/dst-wasm/fft44-wasm";
import fft47 from "fft-cpp/dst-wasm/fft47-wasm";
import fft47pointers from "fft-cpp/dst-wasm/fft47pointers-wasm";
import fft48 from "fft-cpp/dst-wasm/fft48-wasm";
import fft99b from "fft-cpp/dst-wasm/fft99b-wasm";
import fft99c from "fft-cpp/dst-wasm/fft99c-wasm";
import fftKiss from "fft-cpp/dst-wasm/fftKiss-wasm";
import fftKiss2 from "fft-cpp/dst-wasm/fftKiss2-wasm";


export const base64_versions: Record<string, string> = {
  fft01,
  fft02,
  fft44,
  fft47,
  fft47pointers,
  fft48,
  fft99b,
  fft99c,
  fftKiss,
  fftKiss2,
};

type API = {
  prepare_fft(n: number): number,
  run_fft(fft: number, input: number, output: number, direction: number): void,
  delete_fft(fft: number): void,

  malloc(size: number): number,
  free(p: number): void,
};

class TestableFFTFromWASM implements TestableFFT {
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
      throw new Error("Trying to use disposed TestableFFTFromWASM instance");
    }
  }

  setInput(i: number, value: Complex): void {
    this.checkDisposed();
    const dv = new DataView(this.memory.buffer);
    dv.setFloat64(this.input + 16 * i + 0, value.re, true);
    dv.setFloat64(this.input + 16 * i + 8, value.im, true);
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

export const testableWasmVersions: Record<string, Promise<TestableFFTFactory>> =
  mapObject(base64_versions, async (base64_version) => {
    try {
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
      return (size: number): TestableFFT =>
        new TestableFFTFromWASM(memory, instance.exports as API, size);
    } catch (e) {
      console.error("Problem while setting up WASM instance:", e);
      // debugger;
      throw e;
    }
  });
