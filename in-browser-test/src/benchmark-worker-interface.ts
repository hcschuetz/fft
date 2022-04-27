
export type BenchmarkState = number | "" | "pause" | "run";

export type WorkerMessage =
  { type: "value", version: string, blockNo: number, value: BenchmarkState }
| { type: "done" }
;

export type ComputeArgs = {
  testVersionList: string[],
  nBlocks: number,
  pause: number,
  blockSize: number,
  n: number,
  versionMajor: boolean,
};
