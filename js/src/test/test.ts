import { Complex, minus, timesScalar, abs2 } from "../complex/Complex.js";
import { getComplex } from "../complex/ComplexArray.js";
import { indexedVersions, versions } from "./versions.js";
import { makeTestData } from "./utils.js";

async function test(m: number = 6) {
  const n = 1 << m;
  console.log(`\n========== 2**${m} = ${n} points ==========`);
  const scale = 1/n;
  const scaled = (x: Complex) => timesScalar(x, scale);

  const data = makeTestData(n);

  const { fft: fft01 } = await import("../fft/fft01.js");
  const out01 = fft01(data);
  const inv_out01 = fft01(out01, -1);

  const dist = (f: (i: number) => Complex, g: (i: number) => Complex): string => {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += abs2(minus(f(i), g(i)));
    }
    return (Math.sqrt(sum / n) * 1e16).toFixed(3) + "e-16";
  }

  console.log("------- fft01 -------");
  console.log("ifft*fft:", dist(
    i => getComplex(data, i),
    i => scaled(getComplex(inv_out01, i))
  ));

  const testVersions = versions.filter(({ actions }) => actions.includes("t"));
  for (const {actions, name, func, basedOn} of testVersions) {
    if (!actions.includes("t")) continue;
    console.log(`------- ${name} -------`);
    const fft = await func(n);
    const ifft = await func(n, -1);
    const out = fft(data);
    const inv_out = ifft(out);
    console.log("vs. 01    :", dist(
      i => getComplex(out01, i),
      i => getComplex(out, i),
    ));
    console.log("vs. inv 01:", dist(
      i => scaled(getComplex(inv_out01, i)),
      i => scaled(getComplex(inv_out, i)),
    ));
    console.log("ifft*fft  :", dist(
      i => getComplex(data, i),
      i => scaled(getComplex(inv_out, i)),
    ));
    for (const base of basedOn) {
      const outBase = (await indexedVersions[base].func(n))(data);
      console.log(`vs. ${base} :`, dist(
        i => getComplex(outBase, i),
        i => getComplex(out, i),
      ));
    }
  }
}

for (const m of [/* 0, 1, 2, 3, */ 5, 6]) {
  await test(m);
}
