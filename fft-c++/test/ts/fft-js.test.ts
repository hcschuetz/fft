import { zero } from "complex/dst/Complex";
import { ComplexArray, FFT, getComplex, getDist, Instance, randomComplex, setComplex } from "../../ts/fft-instance-utils";
import { versions as allVersions } from "./info";


// --------------------------------------------------------------------------

const { TECH, SIZES, VERSIONS } = process.env;
const techs = (TECH ?? "JS_NODE,WASM_NODE,NATIVE").split(",").map(t => t.toUpperCase().replace(/-/g, "_"));
const sizes = (SIZES ?? "1,2,4,8,16,32,64,2048").split(",").map(Number);
const versions: string[] = VERSIONS ? VERSIONS.split(",") : allVersions;

test("dummy test to make jest happy", () => expect(0).toBeFalsy());

for (const tech of techs) {
  if (tech !== "NATIVE") { // The NATIVE case is handled elsewhere
    const dstDir = `../../dst-${tech.toLowerCase().replace(/_/g, "-")}/`;
    describe(`Calling compilations to ${tech}`, () => {
      let instance01: Instance;
      beforeAll(async () => {
        const factory01 = (await import(dstDir + "fft01")).default;
        instance01 = await factory01();
      });
      for (const version of versions) {
        describe(`Tests for ${version}`, () => {
          let instance: Instance;
          beforeAll(async () => {
            const factory = (await import(dstDir + version)).default;
            instance = await factory();
          });
          for (const n of sizes) {
            describe(`Tests for size ${n}`, () => {
              let fft01: FFT;
              let a0_01: ComplexArray;
              let a1_01: ComplexArray;
              let fft: FFT;
              let a0: ComplexArray;
              let a1: ComplexArray;
              let a2: ComplexArray;
              beforeAll(() => {
                fft01 = new FFT(instance01, n);
                a0_01 = new ComplexArray(instance01, n);
                a1_01 = new ComplexArray(instance01, n);
                fft = new FFT(instance, n);
                a0 = new ComplexArray(instance, n);
                a1 = new ComplexArray(instance, n);
                a2 = new ComplexArray(instance, n);
                for (let i = 0; i < n; i++) {
                  const c = randomComplex()
                  setComplex(a0_01, i, c);
                  setComplex(a1_01, i, zero);
                  setComplex(a0, i, c);
                  setComplex(a1, i, zero);
                  setComplex(a2, i, zero);
                }
              });
              afterAll(() => {
                fft01.dispose();
                a0_01.dispose();
                a1_01.dispose();
                fft.dispose();
                a0.dispose();
                a1.dispose();
                a2.dispose();
              });

              test(`${version} should not change its input array (n = ${n})`, async () => {
                const a0_bak = new ComplexArray(instance, n);
                for (let i = 0; i < n; i++) {
                  setComplex(a0_bak, i, getComplex(a0, i));
                }

                fft.run(a0, a1);

                for (let i = 0; i < n; i++) {
                  expect(getComplex(a0, i)).toEqual(getComplex(a0_bak, i));
                }
              });

              test(`${version} should produce approximately the same results as fft01 (n = ${n})`, () => {
                fft01.run(a0_01, a1_01);
                fft.run(a0, a1);

                const scale = 1 / Math.sqrt(n);
                expect(getDist(a1, a1_01, scale, scale)).toBeCloseTo(0, 13);
              });

              test(`inverse ${version} should produce approximately the same results as inverse fft01 (n = ${n})`, () => {
                fft01.run(a0_01, a1_01, -1);
                fft.run(a0, a1, -1);

                const scale = 1 / Math.sqrt(n);
                expect(getDist(a1, a1_01, scale, scale)).toBeCloseTo(0, 13);
              });

              test(`IFFT(FFT(input))/n should be approximately equal to input (${version}, n = ${n})`, () => {
                fft.run(a0, a1,  1);
                fft.run(a1, a2, -1);
                expect(getDist(a2, a0, 1/n, 1)).toBeCloseTo(0, 13);  
              });
            });
          }
        });
      }
    });
  }
}
