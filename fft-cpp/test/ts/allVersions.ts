import { FFTFactory } from "fft-api/dst";

import { versions as versionsJS     } from "../../ts/api-js";
import { versions as versionsWASM   } from "../../ts/api-wasm";
import { versions as versionsNATIVE } from "../../dst/api-native";

const allVersions: Record<string, Record<string, () => Promise<FFTFactory>>> = {
  JS    : versionsJS,
  WASM  : versionsWASM,
  NATIVE: versionsNATIVE,
}

export default allVersions;
