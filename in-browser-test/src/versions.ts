import { FFTFactory } from "fft-api/dst";
import { versions as tsVersions } from "fft-ts/dst/api";
import { versions as cppVersions } from "fft-cpp/dst/api-js";
import { versions as wasmVersions } from "fft-cpp/dst/api-wasm";
import { versions as mylangVersions } from "fft-mylang/dst/api";

import prefixKeys from "./prefixKeys";
import mapObject from "./mapObject";
import asPromise from "./asPromise";

export const versions: Record<string, Promise<FFTFactory>> = {
  ...prefixKeys("TJ\u00a0", mapObject(tsVersions, asPromise)),
  ...prefixKeys("CJ\u00a0", mapObject(cppVersions, func => func())),
  ...prefixKeys("CW\u00a0", mapObject(wasmVersions, func => func())),
  ...prefixKeys("MW\u00a0", mapObject(mylangVersions, func => func())),
};
