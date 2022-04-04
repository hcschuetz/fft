#!/usr/bin/env node
import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import { spawnCommand } from "./spawnCommand.mjs";

const emcc = process.platform.startsWith("win") ? "emcc.bat" : "emcc";

async function emitSelectImpl({version}) {
  await writeFile("src/selectImpl.h++", `
#ifndef SELECT_IMPL
#define SELECT_IMPL 1

#include "${version}.h++"

#define FFTImpl FFT${version.substring(3)}

#endif
`);
}

const binDir = `test/bin/`;
const test_o = binDir + "test.o";
const perf_o = binDir + "perf.o";

async function compileNativeTest() {
  await mkdir(binDir, {recursive: true});
  switch ((process.env.NATIVE_TESTER ?? "C").toUpperCase()) {
  case "C":
    await spawnCommand("gcc", [
      "-c",
      "-o", test_o,
      "-I", "src",
      "test/native/test.c",
    ]);
    break;
  case "C++":
  case "CPP":
    await spawnCommand("g++", [
      "-c", "-O4",
      "-o", test_o,
      "-I", "src",
      "test/native/test.c++",
    ]);
    break;
  default:
    throw new Error("NATIVE_TESTER should be 'C' or 'C++' or missing");
  }

  // We are able to test the API from C and C++, but it suffices to run
  // performance measurements from a single language.
  await spawnCommand("g++", [
    "-c", "-O4",
    "-o", perf_o,
    "-I", "src",
    "-std=c++17",
    "test/native/perf.c++",
  ]);
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

  // The following linking steps are for test code, not productive code.
  const dstDir = "dst-native/";
  await spawnCommand("g++", [
    "-O4",
    "-o", binDir + "test_" + version,
    test_o,
    dstDir + version + "_c_bindings.o",
    dstDir + version + ".o",
  ]);
  await spawnCommand("g++", [
    "-O4",
    "-o", binDir + "perf_" + version,
    perf_o,
    dstDir + version + "_c_bindings.o",
    dstDir + version + ".o",
  ]);
}

async function compile({version, wasm, web, outDir}) {
  await emitSelectImpl({version});
  const outFileBase = `${outDir}/${version}`;
  await spawnCommand(emcc, [
    "-o", `${outFileBase}.js`,
    "-std=c++17",
    "--memory-init-file", "0",
    "-s", "MODULARIZE=1",
    ...web ? ["-s", "ENVIRONMENT=web",] : [],
    "-s", `WASM=${Number(wasm)}`,
    "-s", "FILESYSTEM=0",
    "-s", "EXPORTED_FUNCTIONS=_malloc,_free,_prepare_fft,_run_fft,_delete_fft",
    "-s", "EXPORTED_RUNTIME_METHODS=setValue,getValue",
    "-O3",
    `src/${version}.c++`, "src/c_bindings.c++",
  ]);
  await writeFile(`${outFileBase}.d.ts`, `
import { Instance } from "../dst/fft-instance-utils";
declare function Module(): Promise<Instance>;
export default Module;  
`);
}

async function compileTechForVersion({tech, version, outDir}) {
  console.log(`==== ${tech} ${version} ====`);
  switch (tech) {
    case "NATIVE"   : await compileNative({version, outDir}); break;
    // In the JS case compiler output for the web environment actually does
    // work with node, but compiler output for node does not work in the
    // browser.  So we only create a single JS build, which is for the web
    // environment.
    case "JS"       : await compile({version, wasm: false, web: true, outDir}); break;
    case "WASM_NODE": await compile({version, wasm: true , web: false, outDir}); break;
    case "WASM_WEB" : await compile({version, wasm: true , web: true , outDir}); break;
    default:
      console.error(`
Environment variable TECH has value "${process.env.TECH}".
Comma-separated components of TECH should be:
"NATIVE", "JS", "WASM_NODE" or "WASM_WEB"`);
      break;
  }
}

const { TECH, VERSIONS } = process.env

const versions = VERSIONS ? VERSIONS.split(",") :
  (await readdir("src"))
  .filter(name => name.match(/fft.+\.c\+\+/))
  .map(name => name.substring(0, name.length - 4));

const techs =
  (TECH ?? "NATIVE,JS,WASM_NODE,WASM_WEB")
  .split(",").map(t => t.trim().toUpperCase().replace(/-/g, "_"));


async function main() {
  try {
    for (const tech of techs) {
      const outDir = "dst-" + tech.toLowerCase().replace(/_/g, "-");
      await mkdir(outDir, {recursive: true});
      if (tech === "NATIVE") {
        await compileNativeTest();
      }
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
