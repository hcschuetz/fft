import { spawn } from "child_process";
import { abs2, minus, timesScalar } from "complex/dst/Complex";
import { ComplexArray, complexArrayLength, getComplex, makeComplexArray, setComplex } from "complex/dst/ComplexArray";
import { versions as allVersions } from "./info";

const indices = (n: number) => new Array(n).fill(undefined).map((x, i) => i);

export async function fft_native(
  cmd: string,
  f: ComplexArray,
  out: ComplexArray,
  direction: number = 1,
): Promise<void>
{
  const n = complexArrayLength(f);
  const input = [
    direction,
    n,
    ...indices(n).map(i => {
      const {re, im} = getComplex(f, i);
      return `${re} ${im}`;
    }),
  ].map(l => l + "\n").join("");
  const output: string = await new Promise((resolve, reject) => {
    const child = spawn(cmd);
    child.stderr.pipe(process.stderr);
    child.stdin.write(input, error => {
      if (error) {
        reject(error);
        return;
      }
      const chunks: Buffer[] = [];
      child.stdout.on("error", reject);
      child.stdout.on("data", chunk => chunks.push(chunk));
      child.on("close", code => {
        if (code !== 0) {
          reject(new Error(`Command "${cmd}" failed with exit code ${code}.`));
          return;
        }
        resolve(Buffer.concat(chunks).toString("utf-8"));
      });
    })
  });
  output.trim().split("\n").forEach((line, i) => {
    const [re, im] = line.split(" ").map(Number);
    setComplex(out, i, {re, im});
  });
}

export const getDist = (a: ComplexArray, b: ComplexArray, scale_a: number = 1, scale_b: number = 1) => {
  const n = complexArrayLength(a);
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += abs2(minus(
      timesScalar(getComplex(a, i), scale_a),
      timesScalar(getComplex(b, i), scale_b),
    ));
  }
  return Math.sqrt(sum / n);
}

const { TECH, SIZES, VERSIONS } = process.env;
const techs = (TECH ?? "JS_NODE,WASM_NODE,NATIVE").split(",").map(t => t.toUpperCase().replace(/-/g, "_"));
const sizes = (SIZES ?? "1,2,4,8,16,32,64,2048").split(",").map(Number);
const versions: string[] = VERSIONS ? VERSIONS.split(",") : allVersions;

test("dummy test to make jest happy", () => expect(0).toBeFalsy());

for (const tech of techs) {
  if (tech === "NATIVE") { // The non-NATIVE cases are handled elsewhere
    describe(`Running as NATIVE code`, () => {
      const binDir = `test/bin/`;
      const fft01_binary = binDir + "test_fft01";
      for (const version of versions) {
        const binary = binDir + "test_" + version;
        describe(`Tests for ${version}`, () => {
          for (const n of sizes) {
            describe(`Tests for size ${n}`, () => {
              const a0 = makeComplexArray(n);
              const a1 = makeComplexArray(n);
              const a2 = makeComplexArray(n);

              // In the non-native case we also check that an FFT implementation
              // does not change its input array.  In the native case this 
              // requires some support in the native test code.
              // (../native/test.{c,c++})

              test(`${version} should produce approximately the same results as fft01 (n = ${n})`, async () => {
                await fft_native(fft01_binary, a0, a1, 1);
                await fft_native(binary      , a0, a2, 1);

                const scale = 1 / Math.sqrt(n);
                expect(getDist(a2, a1, scale, scale)).toBeCloseTo(0, 13);
              });

              test(`inverse ${version} should produce approximately the same results as inverse fft01 (n = ${n})`, async () => {
                await fft_native(fft01_binary, a0, a1, -1);
                await fft_native(binary      , a0, a2, -1);

                const scale = 1 / Math.sqrt(n);
                expect(getDist(a2, a1, scale, scale)).toBeCloseTo(0, 13);
              });

              test(`IFFT(FFT(input))/n should be approximately equal to input (${version}, n = ${n})`, async () => {
                await fft_native(binary, a0, a1,  1);
                await fft_native(binary, a1, a2, -1);
                expect(getDist(a2, a0, 1/n, 1)).toBeCloseTo(0, 13);  
              });
            });
          }
        });
      }
    });
  }
}
