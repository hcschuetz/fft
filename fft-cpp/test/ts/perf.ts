import { performance } from "perf_hooks";
import { randomComplex } from "complex/dst/Complex";
import { FFTFactory } from "fft-api/dst";
import { versions as versionsJS   } from "../../ts/api-js";
import { versions as versionsWASM } from "../../ts/api-wasm";

async function sleep(milliseconds: number) {
  await new Promise(resolve => setTimeout(resolve, milliseconds));
}

const [, , tech, versionName] = process.argv;

const { SIZES, BLOCK_SIZE, N_BLOCKS, PAUSE } = process.env;
const sizes = (SIZES ?? "4,8,512,2048").split(",").map(Number);
const blockSize = Number(BLOCK_SIZE ?? "2000");
const nBlocks = Number(N_BLOCKS ?? "2");
const pause = Number(PAUSE ?? "0");

async function main() {
  const versions: Record<string, () => Promise<FFTFactory>> =
    tech === "JS"   ? versionsJS   :
    tech === "WASM" ? versionsWASM :
    {};
  const version = versions[versionName];
  if (!version) {
    console.error("Version not supported: ", tech, versionName);
    return;
  }
  const factory = await version();
  for (const n of sizes) {
    console.log(`---- n = ${n} ----`);

    const fft = factory(n);

    for (let i = 0; i < n; i++) {
      fft.setInput(i, randomComplex());
    }

    for (let b = 0; b < nBlocks; b++) {
      await sleep(pause * 1000);
      const start = performance.now();
      for (let i = 0; i < blockSize; i++) {
        fft.run();
      }
      const end = performance.now();
      const time_per_run_in_s = (end - start) * 1e-3 / blockSize
      console.log(`${
        (time_per_run_in_s * 1e6).toFixed(3).padStart(8)
      } µs; ${
        (1 / time_per_run_in_s).toFixed().padStart(10)
      } calls/s;`);
    }
    fft.dispose();
  }
}

main();
