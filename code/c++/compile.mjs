#!/usr/bin/env node
import { spawn } from "child_process";
import { mkdir, readdir, readFile, writeFile } from "fs/promises";

const emcc = process.platform.startsWith("win") ? "emcc.bat" : "emcc";

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

async function emitSelectImpl({version}) {
  await writeFile("src/selectImpl.h++", `
#ifndef SELECT_IMPL
#define SELECT_IMPL 1

#include "${version}.h++"

#define FFTImpl FFT${version.substring(3)}

#endif
`);
}

async function compileNative({version, outDir}) {
  await emitSelectImpl({version});
  await spawnCommand("g++", [
    "-c", "-std=c++17", "-O4",
    "-o", `${outDir}/${version}.o`,
    `src/${version}.c++`,
  ]);
  await spawnCommand("g++", [
    "-c", "-std=c++17", "-O4",
    "-o", `${outDir}/${version}_c_bindings.o`,
    "src/c_bindings.c++",
  ]);
}

async function compileNode({version, wasm, outDir}) {
  await emitSelectImpl({version});
  await spawnCommand(emcc, [
    "-o", `${outDir}/${version}.js`,
    "-std=c++17",
    "--memory-init-file", "0",
    "-s", "MODULARIZE=1",
    "-s", `WASM=${Number(wasm)}`,
    "-s", "FILESYSTEM=0",
    "-s", "EXPORTED_FUNCTIONS=_malloc,_free,_prepare_fft,_run_fft,_delete_fft",
    "-s", "EXPORTED_RUNTIME_METHODS=setValue,getValue",
    "-O3",
    `src/${version}.c++`, "src/c_bindings.c++",
  ]);
}

async function compileWebJS({version, outDir}) {
  await emitSelectImpl({version});
  const outFile = `${outDir}/${version}.js`;
  await spawnCommand(emcc, [
    "-o", outFile,
    "-std=c++17",
    "--memory-init-file", "0",
    "-s", "MODULARIZE=1",
    "-s", "ENVIRONMENT=web",
    "-s", "WASM=0",
    "-s", "FILESYSTEM=0",
    "-s", "EXPORTED_FUNCTIONS=_malloc,_free,_prepare_fft,_run_fft,_delete_fft",
    "-s", "EXPORTED_RUNTIME_METHODS=setValue,getValue",
    "-O3",
    `src/${version}.c++`, "src/c_bindings.c++",
  ]);
  const generatedContent = await readFile(outFile);
  await writeFile(outFile, `
const exports = {}, module = {};

${generatedContent}

export default Module;
`);
}

async function compileWebWASM({version, outDir}) {
  await emitSelectImpl({version});
  await spawnCommand(emcc, [
    "-o", `${outDir}/${version}.js`,
    "-std=c++17",
    "--memory-init-file", "0",
    "-s", "MODULARIZE=1",
    "-s", "ENVIRONMENT=web",
    "-s", "WASM=1",
    "-s", "FILESYSTEM=0",
    "-s", "EXPORTED_FUNCTIONS=_malloc,_free,_prepare_fft,_run_fft,_delete_fft",
    "-s", "EXPORTED_RUNTIME_METHODS=setValue,getValue",
    "-O3",
    `src/${version}.c++`, "src/c_bindings.c++",
  ]);
}

async function compileTechForVersion({tech, version, outDir}) {
  console.log(`==== ${tech} ${version} ====`);
  switch (tech) {
    case "NATIVE"   : await compileNative({version, outDir}); break;
    case "JS_NODE"  : await compileNode({version, wasm: false, outDir}); break;
    case "WASM_NODE": await compileNode({version, wasm: true, outDir}); break;
    case "JS_WEB"   : await compileWebJS({version, outDir}); break;
    case "WASM_WEB" : await compileWebWASM({version, outDir}); break;
    default:
      console.error(`
Environment variable TECH has value "${process.env.TECH}".
Comma-separated components of TECH should be:
"NATIVE", "JS_NODE", "WASM_NODE", "JS_WEB" or "WASM_WEB"`);
      break;
  }
}

async function main() {
  try {
    const [, , ...versions] = process.argv;
    if (versions.length === 0) {
      versions.push(
        ...(await readdir("src"))
        .filter(name => name.match(/fft.+\.c\+\+/))
        .map(name => name.substring(0, name.length - 4)),
      );
    }

    const techs =
      (process.env.TECH ?? "NATIVE,JS_NODE,WASM_NODE,JS_WEB,WASM_WEB")
      .split(",").map(t => t.trim().toUpperCase().replace(/-/g, "_"));

    for (const tech of techs) {
      const outDir = "dst-" + tech.toLowerCase().replace(/_/g, "-");
      await mkdir(outDir, {recursive: true});
      for (const version of versions) {
        await compileTechForVersion({tech, version, outDir});
      }
    }
  } catch (e) {
    console.error(e);
    process.exit(0);
  }
}

main();
