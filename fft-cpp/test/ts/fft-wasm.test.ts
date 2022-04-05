import getWasmAPI, { API } from "./get-wasm-api";
import { versions as allVersions } from "./info";

// --------------------------------------------------------------------------

const precision = 12;

const { TECH, SIZES, VERSIONS } = process.env;
const techs = (TECH ?? "JS,WASM,NATIVE").split(",").map(t => t.toUpperCase());
const sizes = (SIZES ?? "1,2,4,8,16,32,64,2048").split(",").map(Number);
const versions: string[] = VERSIONS ? VERSIONS.split(",") : allVersions;

test("dummy test to make jest happy", () => expect(0).toBeFalsy());

for (let tech of techs) {
  if (tech === "WASM") { // The other cases are handled elsewhere
    const dstDir = `dst-wasm/`;
    describe(`Calling compilations to ${tech}`, () => {
      let api01: API;
      beforeAll(async () => {
        api01 = await getWasmAPI(dstDir + "fft01.wasm");
      });
      for (const version of versions) {
        describe(`Tests for ${version}`, () => {
          let api: API;
          beforeAll(async () => {
            api = await getWasmAPI(dstDir + version + ".wasm");
          });
          for (const n of sizes) {
            describe(`Tests for size ${n}`, () => {
              let fft01: number;
              let a0_01: number;
              let a1_01: number;
              let dv01: DataView;
              let fft: number;
              let a0: number;
              let a1: number;
              let a2: number;
              let dv: DataView;
              beforeAll(() => {
                fft01 = api01.prepare_fft(n);
                a0_01 = api01.malloc(16 * n);
                a1_01 = api01.malloc(16 * n);
                dv01 = new DataView(api01.memory.buffer);

                fft = api.prepare_fft(n);
                a0 = api.malloc(16 * n);
                a1 = api.malloc(16 * n);
                a2 = api.malloc(16 * n);
                dv = new DataView(api.memory.buffer);

                for (let i = 0; i < n; i++) {
                  const re = Math.random();
                  const im = Math.random();
                  dv01.setFloat64(a0_01 + 16 * i + 0, re, true);
                  dv01.setFloat64(a0_01 + 16 * i + 8, im, true);
                  dv  .setFloat64(a0    + 16 * i + 0, re, true);
                  dv  .setFloat64(a0    + 16 * i + 8, im, true);
                }
              });
              afterAll(() => {
                api01.delete_fft(fft01);
                api01.free(a0_01);
                api01.free(a1_01);
                api.delete_fft(fft);
                api.free(a0);
                api.free(a1);
                api.free(a2);
              });

              test(`${version} should not change its input array (n = ${n})`, async () => {
                const a0_bak = new Float64Array(2 * n);
                for (let i = 0; i < 2 * n; i++) {
                  a0_bak[i] = dv.getFloat64(a0 + 8 * i, true);
                }

                api.run_fft(fft, a0, a1, 1);

                for (let i = 0; i < 2 * n; i++) {
                  expect(dv.getFloat64(a0 + 8 * i, true)).toEqual(a0_bak[i]);
                }
              });

              test(`${version} should produce approximately the same results as fft01 (n = ${n})`, () => {
                api01.run_fft(fft01, a0_01, a1_01, 1);
                api.run_fft(fft, a0, a1, 1);

                for (let i = 0; i < 2 * n; i++) {
                  expect(dv.getFloat64(a1 + 8 * i, true)).toBeCloseTo(dv01.getFloat64(a1_01 + 8 * i, true), precision);
                }
              });

              test(`inverse ${version} should produce approximately the same results as inverse fft01 (n = ${n})`, () => {
                api01.run_fft(fft01, a0_01, a1_01, -1);
                api.run_fft(fft, a0, a1, -1);

                for (let i = 0; i < 2 * n; i++) {
                  expect(dv.getFloat64(a1 + 8 * i, true)).toBeCloseTo(dv01.getFloat64(a1_01 + 8 * i, true), precision);
                }
              });

              test(`IFFT(FFT(input))/n should be approximately equal to input (${version}, n = ${n})`, () => {
                api.run_fft(fft, a0, a1,  1);
                api.run_fft(fft, a1, a2, -1);

                for (let i = 0; i < 2 * n; i++) {
                  expect(dv.getFloat64(a2 + 8 * i, true) / n).toBeCloseTo(dv.getFloat64(a0 + 8 * i, true), precision);
                }
              });
            });
          }
        });
      }
    });
  }
}
