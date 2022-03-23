#!/usr/bin/env node

import { spawn } from "child_process";
import { mkdir, readdir, readFile, rm, writeFile } from "fs/promises";

const emcc = process.platform === "win32" ? "emcc.bat" : "emcc";

async function spawnCommand(cmd, args) {
  // console.log("spawn:", [cmd, ...args].join(" "));
  await new Promise((resolve, reject) => {
    const child = spawn(cmd, args);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    child.on('close', (code) =>
      code === 0
      ? resolve()
      : reject(new Error(`Command "${cmd}" failed with exit code ${code}.`))
    );
  });
}

async function main() {
  const tech = (process.env.TECH ?? "JS").toUpperCase();
  const noComp = (process.env.NOCOMP ?? "false").toLowerCase() == "true";
  const noRun = (process.env.NORUN ?? "false").toLowerCase() == "true";
  let baseTech, mainFiles, wasm;
  switch (tech) {
    case "C": {
      baseTech = "native";
      mainFiles = ["src/test.c", "src/c_bindings.c++"];
      // In this case the actual FFT implementation is still in C++.
      // It's just the test code that is in C, using the C-language bindings.
      break;
    }
    case "C++": {
      baseTech = "native";
      mainFiles = ["src/fft01.c++", "src/test.c++"];
      break;
    }
    case "JS": {
      baseTech = "web";
      wasm = false;
      break;
    }
    case "WASM": {
      baseTech = "web";
      wasm = true;
      break;
    }
    default: {
      console.error(`
Environment variable TECH has value "${process.env.TECH}".
If present, it should be "C", "C++", "JS" or "WASM".`);
      process.exit(1);
    }
  }

  const outDir = `dst_${tech.toLowerCase()}`;
  await mkdir(outDir, {recursive: true});

  const [, , ...versions] = process.argv;
  if (versions.length === 0) {
    versions.push(
      ...(await readdir("src"))
      .filter(name => name.match(/fft.+\.c\+\+/))
      .map(name => name.substring(0, name.length - 4)),
    );
  }

  for (const version of versions) {
    console.log(`=== ${tech} ${version} ===`);
    await writeFile("src/selectImpl.h++", `
#ifndef FFT_IMPL
#define FFT_IMPL 1

#include "${version}.h++"

#define FFTImpl FFT${version.substring(3)}

#endif
`);
    switch (baseTech) {
      case "native": {
        if (!noComp) {
          const source =
            tech == "C++" && version == "fft01"
            ? [] // avoid duplicate (we use fft01 anyway for comparison)
            : [`src/${version}.c++`];
          await spawnCommand("g++", [
            "-std=c++17", "-O4",
            "-o", `${outDir}/test_${version}`,
            ...mainFiles, ...source,
          ]);
        }
        if (!noRun) {
          await spawnCommand(`${outDir}/test_${version}`);
        }
        break;
      }
      case "web": {
        if (!noComp) {
          await spawnCommand(emcc, [
            "-o", `${outDir}/${version}.js`,
            "-std=c++17",
            "--memory-init-file", "0",
            // With "ENVIRONMENT=web" the generated .js code cannot load the
            // generated .wasm code in node.
            // TODO Find a solution for WASM working on the web.
            ...wasm ? [] : ["-s", "ENVIRONMENT=web"],
            "-s", "MODULARIZE=1",
            "-s", `WASM=${Number(wasm)}`,
            "-s", "FILESYSTEM=0",
            "-s", "EXPORTED_FUNCTIONS=_malloc,_free,_prepare_fft,_run_fft,_delete_fft",
            "-s", "EXPORTED_RUNTIME_METHODS=setValue,getValue",
            "-O3",
            `src/${version}.c++`, "src/c_bindings.c++",
          ]);
          // We now wrap the generated code in a JS module.
          // This is slightly hacky because the wrapper code makes assumptions
          // about internals of the emitted code.
          // But creating a .mjs directly with emcc causes other errors
          // with webpack for the browser.
          // (In some circumstances, but unfortunately not all, the plain .js
          // file can be imported like a JS module.)
          const compilerOutput = await readFile(`${outDir}/${version}.js`);
          await writeFile(`${outDir}/${version}.mjs`, `
const exports = {}, module = {};
// BEGIN EMCC OUTPUT
${compilerOutput}
// END EMCC OUTPUT
export default Module;
`);
          await rm(`${outDir}/${version}.js`);
        }
        if (!noRun) {
          await spawnCommand("node", ["test.mjs", `${outDir}/${version}.mjs`]);
        }
        break;
      }
    }
  }

}

async function runMain() {
  try {
    await main();
  } catch (e) {
    console.error(e);
    process.exit(0);
  }
}

runMain();
