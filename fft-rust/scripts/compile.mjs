import { fileURLToPath } from "node:url";
import { rename, mkdir, readFile, writeFile } from "node:fs/promises";
import { spawnCommand } from "./spawnCommand.mjs";


const implementations = ["fft01", "fft47", "fft_rust"];

const baseURL = new URL("..", import.meta.url);
const getPath = relURL => fileURLToPath(new URL(relURL, baseURL));

const exeSuffix = process.platform.startsWith("win") ? ".exe" : "";
const cmdSuffix = process.platform.startsWith("win") ? ".cmd" : "";

async function selectImpl(name, path) {
  const contents = await readFile(path, "utf-8");
  const firstLineLen = contents.match(/$/m).index;
  const firstLine = contents.substring(0, firstLineLen);
  if (!firstLine.match(/^\s*mod\s+(fft[0-9A-Za-z_]*)\s*;\s*use\s+\1::FFT\s*;\s*$/)) {
    console.error(`unexpected first line in ${path}:`);
    console.log(`>>${firstLine}<<`)
    process.exit(1);
  }
  const rest = contents.substring(firstLineLen);
  const output = `mod ${name}; use ${name}::FFT;${rest}`;

  await writeFile(path, output, "utf-8");
}

async function buildImpl(name) {
  console.log("--- WASM ---");
  const path = getPath("rust/src/lib.rs");
  await selectImpl(name, path);
  await spawnCommand("wasm-pack" + cmdSuffix, ["build", "--target", "no-modules", "--release"]);
  await mkdir(getPath("dst"), {recursive: true});
  await rename(
    getPath("rust/pkg/fft_lib_bg.wasm"),
    getPath(`dst/${name}.wasm`),
  );
  // Just for debugging/curiosity:
  await spawnCommand(process.env.EMSDK + "/upstream/bin/wasm-dis", [
    getPath(`dst/${name}.wasm`),
    "-o", getPath(`dst/${name}.wast`),
  ]);
  
  // This is an ad-hoc solution for packaging WASM.
  // TODO Check if it is possible to use a webpack wasm-loader without
  // ejecting a create-react-app application.
  const wasmCode = await readFile(getPath(`dst/${name}.wasm`));
  await writeFile(
    getPath(`dst/${name}-wasm.js`),
    "export default `\n"
    + wasmCode.toString("base64").match(/.{1,72}/g).join("\n")
    + "\n`;"
  );

  console.log("--- native binary ---");
  await selectImpl(name, getPath("rust/src/main.rs"));
  await spawnCommand("cargo", ["build", "--release", "--bins"]);
  await mkdir(getPath("bin"), {recursive: true});
  await rename(
    getPath(`rust/target/release/fft${exeSuffix}`),
    getPath(`bin/${name}${exeSuffix}`)
  );
}

async function main() {
  process.chdir(getPath("rust"));
  // instead of looping here, we could probably use multiple [lib] and [[bin]]
  // sections in ../rust/Cargo.toml, which would be more idiomatic.
  for (const impl of implementations) {
    console.log(`==== Compile ${impl} ====`);
    await buildImpl(impl);
  }
  console.log(`==== Handle wrapper code ====`);
  const contents = await readFile(getPath("rust/pkg/fft_lib.js"), "utf-8");
  await writeFile(getPath("dst/wrap-wasm.js"),
`export default function make_wasm_bindgen() {

// ------ BEGIN CODE FROM WASM-PACK ------
${contents}
// ------  END CODE FROM WASM-PACK  ------

return wasm_bindgen;
}
`,
    "utf-8",
  );
  await writeFile(getPath("dst/wrap-wasm.d.ts"),
  // The following stuff should be extracted from fft_lib.d.ts generated by
  // wasm-pack.
`declare type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export declare interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_fftapi_free: (a: number) => void;
  readonly fftapi_new: (a: number) => number;
  readonly fftapi_set_input: (a: number, b: number, c: number, d: number) => void;
  readonly fftapi_input_start: (a: number) => number;
  readonly fftapi_run: (a: number, b: number) => void;
  readonly fftapi_get_output_re: (a: number, b: number) => number;
  readonly fftapi_get_output_im: (a: number, b: number) => number;
  readonly fftapi_output_start: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
}

/**
* If \`module_or_path\` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls \`WebAssembly.instantiate\` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
declare type wasm_bindgen = (module_or_path?: InitInput | Promise<InitInput>) => Promise<InitOutput>;
declare function make_wasm_bindgen(): wasm_bindgen;
export default make_wasm_bindgen;  
`,
      "utf-8",
    );
  console.log("==== Rust compilation done ====");
}

main();
