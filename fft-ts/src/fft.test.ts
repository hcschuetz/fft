import { timesScalar, minus, abs2 } from 'complex/dst/Complex';
import { ComplexArray, complexArrayLength, copyComplexArray, getComplex, makeComplexArray, setComplex } from 'complex/dst/ComplexArray';
import { fft as fft01 } from './fft01';
import { FFTPrep, FFTRun } from './fft_types';
import { versions as allVersions } from "./info";


const { SIZES, VERSIONS } = process.env;
const sizes = (SIZES ?? "1,2,4,8,16,32,64,2048").split(",").map(Number);
const versions: string[] = VERSIONS ? VERSIONS.split(",") : allVersions;

const sumToN = (n : number, func: (x: number) => number) => {
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += func(i);
  }
  return sum;
};

const getDist = (a0: ComplexArray, a1: ComplexArray, scale0 = 1, scale1 = 1) => {
  const n = complexArrayLength(a0);
  return Math.sqrt(sumToN(n, i =>
    abs2(minus(
      timesScalar(getComplex(a0, i), scale0),
      timesScalar(getComplex(a1, i), scale1)))
  ) / n);
};

describe(`FFT tests`, () => {
  const inputs: ComplexArray[] = [];
  const outputs: ComplexArray[] = [];
  const outputsInv: ComplexArray[] = [];
  for (const n of sizes) {
    const input = makeComplexArray(n);
    for (let i = 0; i < n; i++) {
      setComplex(input, i, {re: Math.random(), im: Math.random()});
    }
    inputs[n] = input;
    outputs[n] = fft01(input, 1);
    outputsInv[n] = fft01(input, -1);
  }

  for (const version of versions) {
    describe(`Tests for ${version}`, () => {
      let fft_prepare: FFTPrep;
      beforeAll(async () => {
        // import("./" + version) does not work (at least with jest 27.5.1).
        // While issue https://github.com/kulshekhar/ts-jest/issues/258 is
        // closed, I still did not succeed in dynamically importing the TS file.
        // So I am importing the generated JS here even though
        // - we need to build before testing and
        // - we need to know here where the build output goes.
        fft_prepare = (await import("../dst/" + version)).fft_prepare;
      });

      for (const n of sizes) {
        let fft: FFTRun;
        beforeAll(() => {
          fft = fft_prepare(n);
        });

        describe(`Tests for size ${n}`, () => {
          const input = inputs[n];

          test(`${version} should not change its input array (n = ${n})`, async () => {
            const a0 = makeComplexArray(n);
            copyComplexArray(input, a0);

            const a1 = makeComplexArray(n);
            fft(a0, a1);

            for (let i = 0; i < n; i++) {
              expect(getComplex(a0, i)).toEqual(getComplex(input, i));
            }

          });

          test(`${version} should produce approximately the same results as fft01 (n = ${n})`, () => {
            const a1 = makeComplexArray(n);
            fft(input, a1);

            const scale = 1 / Math.sqrt(n);
            expect(getDist(a1, outputs[n], scale, scale)).toBeCloseTo(0, 13);
          });

          test(`inverse ${version} should produce approximately the same results as inverse fft01 (n = ${n})`, () => {
            const a1 = makeComplexArray(n);
            fft(input, a1,  -1);

            const scale = 1 / Math.sqrt(n);
            expect(getDist(a1, outputsInv[n], scale, scale)).toBeCloseTo(0, 13);
          });

          test(`IFFT(FFT(input))/n should be approximately equal to input (${version}, n = ${n})`, async () => {
            const a1 = makeComplexArray(n);
            fft(input, a1,  1);

            const a2 = makeComplexArray(n);
            fft(a1, a2, -1);

            expect(getDist(a2, input, 1 / n, 1)).toBeCloseTo(0, 13);
          });
        });
      }
    });
  }
});
