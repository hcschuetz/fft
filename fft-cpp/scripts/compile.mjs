#!/usr/bin/env node
import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import { spawnCommand } from "./spawnCommand.mjs";

const emcc = process.platform.startsWith("win") ? "emcc.bat" : "emcc";

const binDir = `test/bin/`;
const test_o = binDir + "test.o";

async function compileNativeTest() {
  await mkdir(binDir, {recursive: true});
  await spawnCommand("g++", [
    "-c", "-O4",
    "-o", test_o,
    "-I", "src",
    "test/native/test.c++",
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
}

async function compileWASMClang({version, outDir}) {
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
}

async function compileWASMEmscripten({version, outDir}) {
  const outFileBase = `${outDir}/${version}`;
  await spawnCommand(emcc, [
    ...process.env.EMCC_V ? ["-v"] : [],
    ...process.env.EMCC_G ? ["-g"] : [],
    "-o", `${outFileBase}.wasm`,
    "--memory-init-file", "0",
    "-s", "MODULARIZE=1",
    "-s", "ENVIRONMENT=web",
    "-s", "WASM=1",
    "-s", "SIDE_MODULE=2",
    "--no-entry",
    "-s", "FILESYSTEM=0",
    "-s", "EXPORTED_FUNCTIONS=_malloc,_free,_prepare_fft,_run_fft,_delete_fft",
    "-s", "EXPORTED_RUNTIME_METHODS=setValue,getValue",
    "-O3",
    `src/${version}.c++`,
    "src/lib.c",
  ]);
}

const compilerName = (process.env.COMPILER ?? "").charAt(0).toLowerCase();
console.log(compilerName)

async function compileWASM({version, outDir}) {
  const compileWASMFunc =
    compilerName === "c" ? compileWASMClang :
    compilerName === "e" ? compileWASMEmscripten :
    // For some reason fftKiss2 does not work with plain Clang.
    // TODO Investigate why.
    // For now we go back to Emscripten for this case.
    version === "fftKiss2" ? compileWASMEmscripten :
    compileWASMClang;

  await compileWASMFunc({version, outDir});

  const outFileBase = `${outDir}/${version}`;

  // For informational/debugging purposes:
  await spawnCommand(process.env.EMSDK + "/upstream/bin/wasm-dis", [
    `${outFileBase}.wasm`,
    "-o", `${outFileBase}.wast`,
  ]);

  // This is an ad-hoc solution for packaging WASM.
  // TODO Check if it is possible to use a webpack wasm-loader without
  // ejecting a create-react-app application.
  const wasmCode = await readFile(`${outFileBase}.wasm`);
  await writeFile(
    `${outFileBase}-wasm.js`,
    "export default `\n"
    + wasmCode.toString("base64").match(/.{1,72}/g).join("\n")
    + "\n`;"
  );
}

async function compileJS({version, outDir}) {
  const outFileBase = `${outDir}/${version}`;
  const cjsFile = `${outFileBase}.cjs`;
  await spawnCommand(emcc, [
    ...process.env.EMCC_V ? ["-v"] : [],
    ...process.env.EMCC_G ? ["-g"] : [],
    "-o", cjsFile,
    "--memory-init-file", "0",
    "-s", "MODULARIZE=1",
    // Compiler output for the web environment actually does
    // work with node, but compiler output for node does not work in the
    // browser.  So we only create a single JS build, which is for the web
    // environment.
    "-s", "ENVIRONMENT=web",
    "-s", "WASM=0",
    "-s", "FILESYSTEM=0",
    "-s", "EXPORTED_FUNCTIONS=_malloc,_free,_prepare_fft,_run_fft,_delete_fft",
    "-s", "EXPORTED_RUNTIME_METHODS=setValue,getValue",
    "-O3",
    `src/${version}.c++`,
    "src/lib.c",
  ]);
  // Wrap the EMCC-generated UMD (which can be used as CommonJS) in an ES module:
  await writeFile(`${outFileBase}.js`, `
const exports = {};
const module = { exports };
${await readFile(cjsFile, {encoding: "utf-8"})}
export default module.exports;
`);
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
