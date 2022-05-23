import { FFTFactory } from "fft-api/dst";

import { versions as versionsTS         } from "fft-ts/dst/api.js"
import { versions as versionsCPP_native } from "fft-cpp/dst/api-native.js";
import { versions as versionsCPP_JS     } from "fft-cpp/dst/api-js.js";
import { versions as versionsCPP_WASM   } from "fft-cpp/dst/api-wasm.js";
import { versions as versionsMyLang     } from "fft-mylang/dst/api.js";

const versions: Record<string, () => Promise<FFTFactory>> = Object.fromEntries([
  ...Object.entries(versionsTS        ).map(([name, version]) => ["TJ " + name, async() => version]),
  ...Object.entries(versionsCPP_native).map(([name, version]) => ["CN " + name, version]),
  ...Object.entries(versionsCPP_JS    ).map(([name, version]) => ["CJ " + name, version]),
  ...Object.entries(versionsCPP_WASM  ).map(([name, version]) => ["CW " + name, version]),
  ...Object.entries(versionsMyLang    ).map(([name, version]) => ["MW " + name, version]),
]);

export default versions;
