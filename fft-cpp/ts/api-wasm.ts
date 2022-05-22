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
  runBlock(nCalls: number, direction: number = 1): number {
    const start = performance.now();
    for (let i = 0; i < nCalls; i++) {
      this.api.run_fft(this.fft, this.input, this.output, direction);
    }
    const end = performance.now();
    return (end - start) * 1e-3;
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
    this.checkDisposed();
    this.api.delete_fft(this.fft);
    this.api.free(this.input);
    this.api.free(this.output);
    this.isDisposed = true;
  }
}

export const versions: Record<string, () => Promise<FFTFactory>> =
  Object.fromEntries(
    versionNames
    .map(name => {
      async function makeFactoryPromise(): Promise<FFTFactory> {
        try {
          const imported = await import(`../dst-wasm/${name}-wasm.json`);
          const base64_version = imported.default;
          const bytes = decodeBase64(base64_version);

          const memory = new WebAssembly.Memory({initial: 2, maximum: 256});
          // some implementations need more stack...
          const stackSize = /^fft0[12]$/.test(name) ? (1 << 23) : (1 << 16);
          const heap = makeHeap(memory, stackSize, {shouldSelfCheck: "quiet"});

          const module = await WebAssembly.compile(bytes);
          const envFuncImports =
            WebAssembly.Module.imports(module).flatMap(({module, name, kind}) =>
              module === "env" && kind === "function" ? [name] : []
            );
          const funcExports =
            WebAssembly.Module.exports(module).flatMap(({name, kind}) =>
              kind === "function" ? [name] : []
            );
          const circularFuncs = funcExports.filter(name => envFuncImports.includes(name));
          // Under certain circumstances modules are unlinked in the sense
          // that some functions are both imported and exported.
          // The linkFuncs close this self-dependency at runtime.
          // (This is less efficient than proper linking.)
          const linkFuncs = Object.fromEntries(circularFuncs.map(name => [
            name,
            (...args: any[]) => (instance as any).exports[name](...args)
          ]));

          // Hack: If the WASM module wants to import functions whose names
          // sound related to problem-handling, we simply provide such
          // functions and hope that they will not be called.  But if they are,
          // they will simply throw an exception.
          const errorFuncs = Object.fromEntries(
            envFuncImports.filter(name => /error|exception|throw/i.test(name))
            .map(name => [
              name,
              () => {
                throw new Error(`Error handling function "${name}" called from WASM`);
              }
            ])
          )
 
          // Most of our modules need only a few imports, but here are all the
          // imports that might be needed by any module.
          // TODO create module-specific import objects?
          const imports: WebAssembly.Imports = {
            env: {
              ...errorFuncs,
              ...linkFuncs,
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
              __memory_base: 0,
            },
            "GOT.func": {
              _ZNSt12length_errorD1Ev: new WebAssembly.Global({value: 'i32', mutable: true}, 0),
            },
            "GOT.mem": {
              _ZTISt12length_error: new WebAssembly.Global({value: 'i32', mutable: true}, 0),
              _ZTVSt12length_error: new WebAssembly.Global({value: 'i32', mutable: true}, 0),
            }
          };

          const instance = await WebAssembly.instantiate(module, imports);
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
