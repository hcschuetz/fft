import makeTestData from "./makeTestData";
import sleep from "./sleep";
import { FFT, FFTFactory } from "fft-api/dst";
import { versions } from './versions';
import { BenchmarkState, ComputeArgs, WorkerMessage } from "./benchmark-worker-interface";


// Adding "webworker" to compilerOptions.lib in tsconfig.json should make `self`
// available, but it did not help.
// So we make "self" available the brute-force way:
// TODO find a cleaner solution.
declare const self: any;

function emit(message: WorkerMessage) {
  self.postMessage(message);
}

function emitValue(version: string, blockNo: number, value: BenchmarkState) {
  emit({ type: "value", version, blockNo, value});
}

function emitDone() {
  emit({ type: "done" });
}

self.onmessage = ({ data }: { data: ComputeArgs }) => {
  compute(data);
};

async function compute({
  testVersionList, nBlocks, pause, blockSize, n, versionMajor
}: ComputeArgs): Promise<void> {
  const data = makeTestData(n);

  const runBlock = async (name: string, fft: FFT, i: number) => {
    if (pause > 0) {
      emitValue(name, i, "pause");
      await sleep(pause * 1e3);
    }
    emitValue(name, i, "run");
    const start = performance.now();
    for (let j = 0; j < blockSize; j++) {
      fft.run(1);
    }
    const time = (performance.now() - start) * 1e-3 / blockSize;
    emitValue(name, i, time);
  }

  const versionEntries = [];
  for (const name of testVersionList) {
    // TODO safeguard against failing or slow `await`?
    const version: FFTFactory = await versions[name];
    const fft = version(n);
    for (let i = 0; i < n; i++) {
      fft.setInput(i, data[i]);
    }
    versionEntries.push({name, fft});
  }
  if (versionMajor) {
    for (const { name, fft } of versionEntries) {
      for (let i = 0; i < nBlocks; i++) {
        await runBlock(name, fft, i);
      }
    }
  } else {
    for (let i = 0; i < nBlocks; i++) {
      for (const { name, fft } of versionEntries) {
        await runBlock(name, fft, i);
      }
    }
  }
  emitDone();
}
