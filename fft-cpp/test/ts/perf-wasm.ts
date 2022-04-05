import { performance } from "perf_hooks";
import getWasmAPI from "./get-wasm-api";

async function sleep(milliseconds: number) {
  await new Promise(resolve => setTimeout(resolve, milliseconds));
}

const [, , filename] = process.argv;

const { SIZES, BLOCK_SIZE, N_BLOCKS, PAUSE } = process.env
const sizes = (SIZES ?? "4,8,512,2048").split(",").map(Number);
const blockSize = Number(BLOCK_SIZE ?? "2000");
const nBlocks = Number(N_BLOCKS ?? "2");
const pause = Number(PAUSE ?? "0");

async function main() {
  const {malloc, free, prepare_fft, run_fft, delete_fft, memory} =
    await getWasmAPI(filename);

  for (const n of sizes) {
    console.log(`---- n = ${n} ----`);

    const fft_run = prepare_fft(n);
    const a0 = malloc(n * 16);
    const a1 = malloc(n * 16);
    const dv = new DataView(memory.buffer);
    for (let i = 0; i < n; i++) {
      dv.setFloat64(a0 + 16 * i + 0, Math.random(), true); // re
      dv.setFloat64(a0 + 16 * i + 8, Math.random(), true); // im
    }

    for (let b = 0; b < nBlocks; b++) {
      await sleep(pause * 1000);
      const start = performance.now();
      for (let i = 0; i < blockSize; i++) {
        run_fft(fft_run, a0, a1, 1);
      }
      const end = performance.now();
      const time_per_run_in_s = (end - start) * 1e-3 / blockSize
      console.log(`${
        (time_per_run_in_s * 1e6).toFixed(3).padStart(8)
      } µs; ${
        (1 / time_per_run_in_s).toFixed().padStart(10)
      } calls/s;`);
    }
    delete_fft(fft_run);
    free(a0);
    free(a1);
  }
}

main();
