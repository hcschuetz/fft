#!/usr/bin/env node
import { readdir } from "fs/promises";
import { spawnCommand } from "./spawnCommand.mjs";

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
    case "JS": await runNode({version, tech: "js"}); break;
    case "WASM_JS": await runNode({version, tech: "wasm-node"}); break;
    case "WASM":
      await spawnCommand(ts_node, [
        "test/ts/perf-wasm.ts",
        `dst-wasm-web/${version}.wasm`,
      ]);
      break;
    default:
      // TODO such explanations should be written upon argument --help
      console.error(`
Environment variable TECH has value "${process.env.TECH}".
Comma-separated components of TECH should be taken from these values:
- NATIVE:  Run FFTs compiled to native code.
- JS:      Run FFTs compiled to JS.
- WASM_JS: Run FFTs compiled to WASM (via the emcc-generated JS wrapper).
- WASM:    Run FFTs compiled to WASM.
`);
      break;
  }
}


const { VERSIONS, TECH } = process.env;

const versions = VERSIONS ? VERSIONS.split(",") :
  (await readdir("src"))
  .filter(name => name.match(/fft.+\.c\+\+/))
  .map(name => name.substring(0, name.length - 4));

const allTechs = "NATIVE,JS,WASM_JS,WASM";
const techs =
  (TECH ?? allTechs).split(",")
  .map(t => t.toUpperCase().replace(/[-_]NODE$/, ""));

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
