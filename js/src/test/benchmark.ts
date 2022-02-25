import { complexArrayLength } from "../complex/ComplexArray.js";
import { versions } from "./versions.js";
import { makeTestData } from "./utils.js";

const blocks = 5, blockLen = 2000;
const sleepTime = 0 // 20e3; // sleep 20s between tests

const n = 1 << 11;
const data = makeTestData(n);

const display = (t: number) => (t * 1e3).toFixed(3) + "µs";

const sleep = async (duration: number): Promise<void> =>
  new Promise(res => setTimeout(() => res(undefined), duration));

console.log(`Legend: best block time (calls per s for this time) -- average time -- block times`);
console.log(`=========== ${n} points ===========`);
const benchmarkVersions = versions.filter(({ actions }) => actions.includes("b"));
for (const {name, func, basedOn, comment} of benchmarkVersions) {
  const run = await func(complexArrayLength(data))
  await sleep(sleepTime); // let the processor cool down

  const res: number[] = [];
  const begin = performance.now();
  let blockBegin = begin;
  for (let i = 0; i < blocks; i++) {
    for (let j = 0; j < blockLen; j++) {
      run(data);
    }
    const blockEnd = performance.now();
    res.push((blockEnd - blockBegin) / blockLen);
    blockBegin = blockEnd;
  }
  const end = performance.now();
  console.log("----------------");
  console.log(
    `${name}${basedOn.length === 0 ? '' : ` (based on ${basedOn.join(", ")})`}:`,
  );
  console.log(
    display(Math.min(...res)),
    `(${(1e3/Math.min(...res)).toFixed()} / s)`,
    "--",
    display((end - begin) / (blocks * blockLen)),
    "--",
    res.map(display).join(" "),
  );
  // console.log(comment?.replaceAll(/^/mg, "  "));
}