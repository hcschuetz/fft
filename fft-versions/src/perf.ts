import { randomComplex } from "complex/dst/Complex.js";
import versions from "./versions.js";


const { VERSIONS, SIZES, N_BLOCKS, PAUSE, BLOCK_SIZE } = process.env;

const versionsRegexp = new RegExp(VERSIONS ?? "");
const sizes = (SIZES ?? "4,8,512,2048").split(",").map(Number);
const nBlocks = Number(N_BLOCKS ?? "2");
const pause = Number(PAUSE ?? "0");
const blockSize = Number(BLOCK_SIZE ?? "2000");

async function sleep(milliseconds: number) {
  await new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function main() {
  try {
    const selectedVersions =
      Object.entries(versions).filter(([name]) => versionsRegexp.test(name));
    for (const [versionName, version] of selectedVersions) {
      console.log(`==== ${versionName} ====`);
      const factory = await version();
      for (const n of sizes) {
        console.log(`---- n = ${n} ----`);
    
        const fft = factory(n);
    
        for (let i = 0; i < n; i++) {
          fft.setInput(i, randomComplex());
        }
    
        for (let b = 0; b < nBlocks; b++) {
          await sleep(pause * 1000);
          const total_time = fft.runBlock(blockSize);
          const time_per_run_in_s = total_time / blockSize
          console.log(`${
            (time_per_run_in_s * 1e6).toFixed(3).padStart(8)
          } µs; ${
            (1 / time_per_run_in_s).toFixed().padStart(10)
          } calls/s;`);
        }
        fft.dispose();
      }
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
