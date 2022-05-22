#!/usr/bin/env node
import { readdir } from "fs/promises";
import { spawnCommand } from "./spawnCommand.mjs";

const ts_node = process.platform.startsWith("win") ? "ts-node.cmd" : "ts-node";

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
        console.log(`==== ${tech} ${version} ====`);
        await spawnCommand(ts_node, ["test/ts/perf.ts", tech, version]);
      }
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
