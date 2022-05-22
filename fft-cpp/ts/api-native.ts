import { spawnSync } from "child_process";
import { Complex } from "complex/dst/Complex";
import { ComplexArray, complexArrayLength, getComplex, makeComplexArray, setComplex } from "complex/dst/ComplexArray";
import { FFT, FFTFactory } from "fft-api/dst";
import { versionNames } from "./info";


const indices = (n: number) => new Array(n).fill(undefined).map((x, i) => i);

function fft_native(
  cmd: string,
  inputArray: ComplexArray,
  outputArray: ComplexArray,
  nCalls: number,
  direction: number,
): number
{
  const n = complexArrayLength(inputArray);
  const input = [
    nCalls,
    direction,
    n,
    ...indices(n).map(i => {
      const {re, im} = getComplex(inputArray, i);
      return `${re} ${im}`;
    }),
  ].map(l => l + "\n").join("");
  const {stdout, stderr, error} = spawnSync(cmd, [], {input});
  if (stderr.length > 0) {
    console.error("native subprocess stderr:");
    console.error("-------------------------");
    console.error(stderr.toString("utf-8"));
    console.error("-------------------------");
  }
  if (error) {
    throw error;
  }
  const output = stdout.toString("utf-8");
  const lines = output.trim().split("\n");
  const time = Number.parseFloat(lines.shift()!.trim());
  lines.forEach((line, i) => {
    const [re, im] = line.split(" ").map(Number);
    setComplex(outputArray, i, {re, im});
  });
  return time;
}

class FFTNative implements FFT {
  private input: ComplexArray;
  private output: ComplexArray;

  constructor(
    readonly binary: string,
    public readonly size: number,
  ) {
    this.input = makeComplexArray(size);
    this.output = makeComplexArray(size);
  }

  setInput(i: number, value: Complex): void {
    setComplex(this.input, i, value);
  }
  /**
   * This method is for testing whether an FFT leaves its input unchanged.
   * So to make sense it would have to get the input from the binary process
   * (which, however, only exists during the calls to fft_native).
   * With the current implementation the tests succeed but are not meaningful.
   * OTOH we do not want them to fail.
   * (TODO Drop these tests?)
   */
  getInput(i: number): Complex {
    return getComplex(this.input, i);
  }
  run(direction: number = 1): void {
    fft_native(this.binary, this.input, this.output, 1, direction);
  }
  runBlock(nCalls: number, direction: number = 1): number {
    return fft_native(this.binary, this.input, this.output, nCalls, direction);
  }
  getOutput(i: number): Complex {
    return getComplex(this.output, i);
  }

  dispose() {
    // do nothing; just leave objects to garbage collection
  }
}

export const versions: Record<string, () => Promise<FFTFactory>> =
  Object.fromEntries(
    versionNames.map((name) => {
      async function makeFFTFactory(): Promise<FFTFactory> {
        return (size: number) => new FFTNative(`test/bin/test_${name}`, size);
      }
      return [name, makeFFTFactory];
    })
  );
