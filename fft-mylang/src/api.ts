import { Complex } from "complex/dst/Complex";
import { FFT, FFTFactory } from "fft-api/dst";
import decodeBase64 from "./decodeBase64.js";
import { versionNames } from "./info.js";

class FFTFromWASMModule implements FFT {
  private input: Float64Array;
  private output: Float64Array;

  private outputStart: number;
  private cosinesStart: number;
  private shuffledStart: number;
  private fft : (size: number, shuffledStart: number, cosinesStart: number, outputStart: number) => void;
  private ifft: (size: number, shuffledStart: number, cosinesStart: number, outputStart: number) => void;

  constructor(
    module: WebAssembly.Module,
    public readonly size: number,
  ) {
    // TODO make this more generic
    // The setup code here is quite specific for fft60.
    // Either move it to a specific JS file for fft60 or even move it into
    // the WASM module.
    const n = size;
    const quarterN = n >>> 2;
  
    const memorySizeInBytes = 41 * n;
    const pageSize = 64 * 1024;  // The WebAssembly page size is 64 KiB.
    const memorySizeInPages = Math.ceil(memorySizeInBytes / pageSize);
    const memory = new WebAssembly.Memory({initial: memorySizeInPages, maximum: memorySizeInPages});
  
    const inputStart = 0;
    const input = new Float64Array(memory.buffer, inputStart, 2*n);
    const outputStart = inputStart + input.byteLength;
    const output = new Float64Array(memory.buffer, outputStart, 2*n);
    const cosinesStart = outputStart + output.byteLength;
    const cosines = new Float64Array(memory.buffer, cosinesStart, n);
    const shuffledStart = cosinesStart + cosines.byteLength;
    const shuffled = new Int32Array(memory.buffer, shuffledStart, quarterN);
    const dataEnd = shuffledStart + shuffled.byteLength;
    if (dataEnd !== memorySizeInBytes) {
      console.error("unexpected data size", dataEnd, "expected:", memorySizeInBytes);
    }

    for (let i = 0; i < quarterN; i++) {
      shuffled[i] = inputStart;
    }
    for (let len = quarterN, fStride = 1; len > 1; len >>>= 1, fStride <<= 1) {
      const halfLen = len >>> 1;
      for (let out_offset = 0; out_offset < quarterN; out_offset += len) {
        const limit = out_offset + len;
        for (let out_offset_odd = out_offset + halfLen; out_offset_odd < limit; out_offset_odd++) {
          shuffled[out_offset_odd] += fStride * 16;
        }
      }
    }
  
    const step = 2 * Math.PI / n;
    for (let i = 0; i < n; i++) {
      cosines[i] = Math.cos(i * step);
    }

    // TODO Pass the instance as constructor argument?
    // This would make an instance usable for multiple sizes.
    // The instance's memory would have to grow dynamically as needed.
    // (AFAIK shrinking memory is not supported.)
    const instance = new WebAssembly.Instance(module, {
      env: {
        memory,
      },
    });
    const {exports} = instance;
    const {fft, ifft} = exports as any;
  
    this.input = input;
    this.output = output;
    this.cosinesStart = cosinesStart;
    this.shuffledStart = shuffledStart;
    this.outputStart = outputStart;
    this.fft = fft;
    this.ifft = ifft;
  }

  setInput(i: number, value: Complex): void {
    this.input[i * 2 + 0] = value.re;
    this.input[i * 2 + 1] = value.im;
  }
  getInput(i: number): Complex {
    return {
      re: this.input[i * 2 + 0],
      im: this.input[i * 2 + 1],
    };  
  }
  run(direction: number = 1): void {
    const fft = direction > 0 ? this.fft : this.ifft;
    fft(this.size, this.shuffledStart, this.cosinesStart, this.outputStart);
  }
  getOutput(i: number): Complex {
    return {
      re: this.output[i * 2 + 0],
      im: this.output[i * 2 + 1],
    };  
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
          const module = new WebAssembly.Module(bytes);
          return (size: number): FFT => new FFTFromWASMModule(module, size);
        } catch (e) {
          console.error("Problem while setting up WASM instance:", e);
          // debugger;
          throw e;
        }
      }
      return [name, makeFactoryPromise];
    })
  );
