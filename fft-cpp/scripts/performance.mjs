#!/usr/bin/env node
import { readdir } from "fs/promises";
import { spawnCommand } from "./spawnCommand.mjs";

const ts_node = process.platform.startsWith("win") ? "ts-node.cmd" : "ts-node";

async function runTechForVersion({version, tech}) {
  console.log(`==== ${tech} ${version} ====`);
  switch (tech) {
    case "NATIVE":
      await spawnCommand(`test/bin/perf_${version}`);
      break;
    case "JS":
    case "WASM":
      await spawnCommand(ts_node, ["test/ts/perf.ts", tech, version]);
      break;
    default:
      // TODO such explanations should be written upon argument --help
      console.error(`
Environment variable TECH has value "${process.env.TECH}".
Comma-separated components of TECH should be taken from these values:
- NATIVE:  Run FFTs compiled to native code.
- JS:      Run FFTs compiled to JS.
- WASM:    Run FFTs compiled to WASM.
`);
      break;
  }
}


const { VERSIONS, TECH } = process.env;

const versions = VERSIONS ? VERSIONS.split(",") :
  (await readdir("src"))
  .filter(name => name.match(/^fft.+\.c\+\+$/))
  .map(name => name.substring(0, name.length - 4));

const techs = (TECH ?? "NATIVE,JS,WASM").split(",").map(t => t.toUpperCase());

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
