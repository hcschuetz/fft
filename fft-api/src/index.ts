import { Complex } from "complex/dst/Complex";

/**
 * A uniform API for the Fast Fourier Transformation,
 * specialized to a particular size.
 * 
 * Certain calculations can already be performed when only the size is known.
 * This is typically done upon creation of an `FFT` instance.
 * 
 * Usage of an `FFT` instance:
 * - Call `setInput` `size` times to set input values with index `0` to 
 *   `size - 1`.
 * - Call `run` to actually perform the transformation.
 * - Call `getOutput` `size` times to retrieve the output values with index `0`
 *   to `size - 1`.
 * 
 * For performance measurements call `run` several times.
 */
export interface FFT {
  readonly size: number;
  setInput(index: number, value: Complex): void;
  /** @deprecated use only for testing */
  getInput(index: number): Complex;
  run(direction?: number): void;
  /** run the FFT `nCalls` times and return the total time in seconds */
  runBlock(nCalls: number, direction?: number): number;
  getOutput(index: number): Complex;
  dispose(): void;
}

/**
 * A factory function for `FFT` instances.
 * An implementation of `FFTFactory` essentially represents an FFT version.
 */
export type FFTFactory = (size: number) => FFT;
