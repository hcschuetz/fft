import { randomComplex } from "complex/dst/Complex";
import { ComplexArray, getComplex, makeComplexArray, setComplex } from "complex/dst/ComplexArray";
import { FFT, FFTFactory } from "fft-api/dst";

import { versions as versionsJS   } from "../../dst/api-js";
import { versions as versionsWASM } from "../../dst/api-wasm";

import { getDist } from "./test-utils";


const { TECH, SIZES, VERSIONS } = process.env;
const techs = (TECH ?? "JS,WASM,NATIVE").split(",").map(t => t.toUpperCase());
const sizes = (SIZES ?? "1,2,4,8,16,32,64,2048").split(",").map(Number);

test("dummy test to make jest happy", () => expect(0).toBeFalsy());

function testTech(tech: string, versions: Record<string, () => Promise<FFTFactory>>): void {
  const versionNames: string[] = VERSIONS ? VERSIONS.split(",") : Object.keys(versions);

  describe(`Calling compilations to ${tech}`, () => {
    let factory01: FFTFactory;
    beforeAll(async () => {
      factory01 = await versions.fft01();
    });
    for (const versionName of versionNames) {
      describe(`Tests for ${versionName}`, () => {
        let factory: FFTFactory;
        beforeAll(async () => {
          factory = await versions[versionName]();
        });
        for (const n of sizes) {
          describe(`Tests for size ${n}`, () => {
            let fft01: FFT;
            let fft: FFT;
            let ifft: FFT;
            let inputBak: ComplexArray;
            beforeAll(() => {
              fft01 = factory01(n);
              fft = factory(n);
              ifft = factory(n);
              inputBak = makeComplexArray(n);
              for (let i = 0; i < n; i++) {
                const z = randomComplex();
                fft01.setInput(i, z);
                fft.setInput(i, z);
                setComplex(inputBak, i, z);
              }
            });

            test(`${versionName} should not change its input array (n = ${n})`, async () => {
              fft.run();

              for (let i = 0; i < n; i++) {
                // This is the place where the otherwise deprecated method
                // FFT.getInput(...) is used:
                expect(fft.getInput(i)).toEqual(getComplex(inputBak, i));
              }
            });

            test(`${versionName} should produce approximately the same results as fft01 (n = ${n})`, () => {
              fft01.run();
              fft.run();

              const scale = 1 / Math.sqrt(n);
              expect(getDist(n,
                i => fft.getOutput(i),
                i => fft01.getOutput(i),
                scale,
                scale,
              )).toBeCloseTo(0, 13);
            });

            test(`inverse ${versionName} should produce approximately the same results as inverse fft01 (n = ${n})`, () => {
              fft01.run(-1);
              fft.run(-1);

              const scale = 1 / Math.sqrt(n);
              expect(getDist(n,
                i => fft.getOutput(i),
                i => fft01.getOutput(i),
                scale,
                scale,
              )).toBeCloseTo(0, 13);
            });

            test(`IFFT(FFT(input))/n should be approximately equal to input (${versionName}, n = ${n})`, () => {
              fft.run(1);
              for (let i = 0; i < n; i++) {
                ifft.setInput(i, fft.getOutput(i));
              }
              ifft.run(-1);
              expect(getDist(n,
                i => ifft.getOutput(i),
                i => getComplex(inputBak, i),
                1/n,
                1,
              )).toBeCloseTo(0, 13);
            });
          });
        }
      });
    }
  });
}

for (let tech of techs) {
  switch (tech) {
    case "JS"  : testTech(tech, versionsWASM); break;
    case "WASM": testTech(tech, versionsJS  ); break;
    default: break; // Case "NATIVE" is handled elsewhere
  }
}
