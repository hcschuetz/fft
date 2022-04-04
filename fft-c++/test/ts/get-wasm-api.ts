import { readFile } from "fs/promises";

export type API = {
  prepare_fft(n: number): number,
  run_fft(fft: number, input: number, output: number, direction: number): void,
  delete_fft(fft: number): void,

  malloc(size: number): number,
  free(p: number): void,

  memory: WebAssembly.Memory,
};

async function getWasmAPI(filename: string): Promise<API> {
  const bytes = await readFile(filename);

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
  return {...instance.exports, memory} as API;
}

export default getWasmAPI;
