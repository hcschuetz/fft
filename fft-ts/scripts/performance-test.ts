#!/usr/bin/env node
import { performance } from 'perf_hooks'; // needed for node 14; not needed for node 16
import { ComplexArray, makeComplexArray, setComplex } from 'complex/dst/ComplexArray';
import { FFTPrep } from '../src/fft_types';
import { versions as allVersions } from "../src/info";

const { SIZES, VERSIONS, BLOCK_SIZE, N_BLOCKS, PAUSE } = process.env;
const sizes = (SIZES ?? "4,8,512,2048").split(",").map(Number);
const versions: string[] = VERSIONS ? VERSIONS.split(",") : allVersions;
const blockSize = BLOCK_SIZE ? Number(BLOCK_SIZE) : 2000;
const nBlocks = N_BLOCKS ? Number(N_BLOCKS) : 2;
const pause = PAUSE ? Number(PAUSE) : 0;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const inputs: ComplexArray[] = [];
const outputs: ComplexArray[] = [];
for (const n of sizes) {
  const input = makeComplexArray(n);
  for (let i = 0; i < n; i++) {
    setComplex(input, i, {re: Math.random(), im: Math.random()});
  }
  inputs[n] = input;
  outputs[n] = makeComplexArray(n);
}

async function main() {
  for (const version of versions) {
    console.log(`==== ${version} ====`);
    const fft_prepare: FFTPrep = (await import("../src/" + version)).fft_prepare;
    for (const n of sizes) {
      console.log(`---- n = ${n} ----`);
      const fft = fft_prepare(n);
      const a0 = inputs[n];
      const a1 = outputs[n];
      for (let j = 0; j < nBlocks; j++) {
        await sleep(pause * 1000);
        const start = performance.now();
        for (let i = 0; i < blockSize; i++) {
          fft(a0, a1, 1);
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
}

main();
