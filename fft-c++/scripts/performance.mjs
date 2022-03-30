#!/usr/bin/env node
import { spawnCommand } from "./spawnCommand";

async function runNative({version}) {
  await spawnCommand(`test/bin/perf_${version}`);
}

const ts_node = process.platform.startsWith("win") ? "ts-node.cmd" : "ts-node";

async function runNode({version, tech}) {
  await spawnCommand(ts_node, [
    "test/ts/perf.ts",
    `../../dst-${tech}/${version}.js`,
  ]);
}

async function runTechForVersion({version, tech}) {
  console.log(`==== ${tech} ${version} ====`);
  switch (tech) {
    case "NATIVE": await runNative({version}); break;
    case "JS":
    case "JS_NODE": await runNode({version, tech: "js-node"}); break;
    case "WASM":
    case "WASM_NODE": await runNode({version, tech: "wasm-node"}); break;
    default:
      // TODO such explanations should be written upon argument --help
      console.error(`
Environment variable TECH has value "${process.env.TECH}".
Comma-separated components of TECH should be taken from these values:
- NATIVE: Run FFTs compiled to native code.
- JS:     Run FFTs compiled to JS.
- WASM:   Run FFTs compiled to WASM.
`);
      break;
  }
}


const { VERSIONS, TECH } = process.env;

const allVersions = "fft01,fft02,fft44,fft47,fft47pointers,fft48,fft99b,fft99c";
const versions = (VERSIONS ?? allVersions).split(",");

const allTechs = "NATIVE,JS,WASM";
const techs =
  (TECH ?? allTechs).split(",")
  .map(t => t.toUpperCase().replace(/[-_]NODE/g, ""));

async function main() {
  try {
    for (const tech of techs) {
      for (const version of versions) {
        await runTechForVersion({version, tech});
      }
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
