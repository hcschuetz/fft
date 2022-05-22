import { readdirSync } from "fs";
import { randomComplex } from "complex/dst/Complex";
import allVersions from "./allVersions";


const { VERSIONS, TECH, SIZES, N_BLOCKS, PAUSE, BLOCK_SIZE } = process.env;

const versionNames = VERSIONS ? VERSIONS.split(",") :
  (readdirSync("src"))
  .filter(name => name.match(/^fft.+\.c\+\+$/))
  .map(name => name.substring(0, name.length - 4));

const techs = (TECH ?? "NATIVE,JS,WASM").split(",").map(t => t.toUpperCase());
const sizes = (SIZES ?? "4,8,512,2048").split(",").map(Number);
const nBlocks = Number(N_BLOCKS ?? "2");
const pause = Number(PAUSE ?? "0");
const blockSize = Number(BLOCK_SIZE ?? "2000");

async function sleep(milliseconds: number) {
  await new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function main() {
  try {
    for (const tech of techs) {
      const versions = allVersions[tech];
      if (!versions) {
        console.error("Tech not supported:", tech);
      }
      for (const versionName of versionNames) {
        console.log(`==== ${tech} ${versionName} ====`);
        const version = versions[versionName];
        if (!version) {
          console.error("Version not supported:", tech, versionName);
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
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
