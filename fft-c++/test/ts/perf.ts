import { performance } from "perf_hooks";
import { ComplexArray, FFT, randomComplex, setComplex } from "./fft-instance-utils";

async function sleep(milliseconds: number) {
  await new Promise(resolve => setTimeout(resolve, milliseconds));
}

const [, , fft] = process.argv;

const { SIZES, BLOCK_SIZE, N_BLOCKS, PAUSE } = process.env
const sizes = (SIZES ?? "4,8,512,2048").split(",").map(Number);
const blockSize = Number(BLOCK_SIZE ?? "2000");
const nBlocks = Number(N_BLOCKS ?? "2");
const pause = Number(PAUSE ?? "0");

async function main() {
  const factory = (await import(fft)).default;
  const instance = await factory();
  for (const n of sizes) {
    console.log(`---- n = ${n} ----`);

    const fft = new FFT(instance, n);

    const a0 = new ComplexArray(instance, n);
    for (let i = 0; i < n; i++) {
      setComplex(a0, i, randomComplex());
    }

    const a1 = new ComplexArray(instance, n);

    for (let b = 0; b < nBlocks; b++) {
      await sleep(pause * 1000);
      const start = performance.now();
      for (let i = 0; i < blockSize; i++) {
        fft.run(a0, a1);
      }
      const end = performance.now();
      const time_per_run_in_s = (end - start) * 1e-3 / blockSize
      console.log(`${
        (time_per_run_in_s * 1e6).toFixed(3).padStart(8)
      } µs; ${
        (1 / time_per_run_in_s).toFixed().padStart(10)
      } calls/s;`);
    }
  }
}

main();
