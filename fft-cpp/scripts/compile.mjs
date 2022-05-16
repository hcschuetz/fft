#!/usr/bin/env node
import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import { spawnCommand } from "./spawnCommand.mjs";

const emcc = process.platform.startsWith("win") ? "emcc.bat" : "emcc";

const binDir = `test/bin/`;
const test_o = binDir + "test.o";
const perf_o = binDir + "perf.o";

async function compileNativeTest() {
  await mkdir(binDir, {recursive: true});
  await spawnCommand("g++", [
    "-c", "-O4",
    "-o", test_o,
    "-I", "src",
    "test/native/test.c++",
  ]);

  // We are able to test the API from C and C++, but it suffices to run
  // performance measurements from a single language.
  await spawnCommand("g++", [
    "-c", "-O4",
    "-o", perf_o,
    "-I", "src",
    "test/native/perf.c++",
  ]);
}

async function compileNative({version, outDir}) {
  const baseName = `${outDir}/${version}`;
  const fft_code_o = `${baseName}.o`;
  await spawnCommand("g++", [
    "-c",
    "-O4",
    "-o", fft_code_o,
    `src/${version}.c++`,
  ]);

  // The following linking steps are for test code, not productive code.
  await spawnCommand("g++", [
    "-O4",
    "-o", binDir + "test_" + version,
    test_o,
    fft_code_o,
  ]);
  await spawnCommand("g++", [
    "-O4",
    "-o", binDir + "perf_" + version,
    perf_o,
    fft_code_o,
  ]);
}

async function compileWASM({version, outDir}) {
  const outFileBase = `${outDir}/${version}`;
  await spawnCommand(process.env.EMSDK + "/upstream/bin/clang", `
    --sysroot=${process.env.EMSDK}/upstream/emscripten/cache/sysroot
    -D__wasi__=1
    --target=wasm32
    -O3
    -flto
    -nostdlib
    -Wl,--no-entry
    -Wl,--export=prepare_fft
    -Wl,--export=run_fft
    -Wl,--export=delete_fft
    -Wl,--unresolved-symbols=ignore-all
    -Wl,--import-undefined
    -Wl,--import-memory
    -Wl,--lto-O3
    -o
    ${outFileBase}.wasm
    src/${version}.c++
    src/lib.c
  `.trim().split(/\r\n|\r|\n/).map(line => line.trim())
  // "-Wl,-shared" seems to enforce importing of __stack_pointer,
  // which the stack-heavy FFT implementations need:
  // (Ignore the warning about creating shared libs not yet being stable.)
  // OTOH we cannot add this option unconditionally because
  // that would crash the linking of fftKiss2.
  // TODO Understand this better
  .concat(/^fft0[12]$/.test(version) ? ["-Wl,-shared"] : [])
  .concat(process.env.CLANG_V ? ["-v"] : []),
  );

  // For informational/debugging purposes:
  spawnCommand(process.env.EMSDK + "/upstream/bin/wasm-dis", [
    `${outFileBase}.wasm`,
    "-o", `${outFileBase}.wast`,
  ]);

  // This is an ad-hoc solution for packaging WASM.
  // TODO Check if it is possible to use a webpack wasm-loader without
  // ejecting a create-react-app application.
  const wasmCode = await readFile(`${outFileBase}.wasm`);
  await writeFile(`${outFileBase}-wasm.js`, `
const ${version}_wasm_base64 = ${"`"}
${wasmCode.toString("base64").match(/.{1,72}/g).join("\n")}
${"`"};

//export default ${version}_wasm_base64;
module.exports = ${version}_wasm_base64;
`);
    await writeFile(`${outFileBase}-wasm.d.ts`, `
declare const ${version}_wasm_base64: string;
export default ${version}_wasm_base64;
`);
}

async function compileJS({version, outDir}) {
  const outFileBase = `${outDir}/${version}`;
  await spawnCommand(emcc, [
    ...process.env.EMCC_V ? ["-v"] : [],
    ...process.env.EMCC_G ? ["-g"] : [],
    "-o", `${outFileBase}.js`,
    "--memory-init-file", "0",
    "-s", "MODULARIZE=1",
    // Compiler output for the web environment actually does
    // work with node, but compiler output for node does not work in the
    // browser.  So we only create a single JS build, which is for the web
    // environment.
    "-s", "ENVIRONMENT=web",
    "-s", `WASM=0`,
    "-s", "FILESYSTEM=0",
    "-s", "EXPORTED_FUNCTIONS=_malloc,_free,_prepare_fft,_run_fft,_delete_fft",
    "-s", "EXPORTED_RUNTIME_METHODS=setValue,getValue",
    "-O3",
    `src/${version}.c++`,
    "src/lib.c",
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
    case "NATIVE": await compileNative({version, outDir}); break;
    case "JS"    : await compileJS    ({version, outDir}); break;
    case "WASM"  : await compileWASM  ({version, outDir}); break;
    default:
      console.error(`
Environment variable TECH has value "${process.env.TECH}".
Comma-separated components of TECH should be:
"NATIVE", "JS", "WASM"`);
      break;
  }
}

const { TECH, VERSIONS } = process.env

const versions = VERSIONS ? VERSIONS.split(",") :
  (await readdir("src")).flatMap(name => {
    const match = name.match(/^(fft.+)\.c\+\+$/);
    return match ? [match[1]] : [];
  });

const techs = (TECH ?? "NATIVE,JS,WASM").split(",").map(t => t.toUpperCase());


async function main() {
  try {
    for (const tech of techs) {
      const outDir = "dst-" + tech.toLowerCase();
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
