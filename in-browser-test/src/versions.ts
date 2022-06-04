import { FFTFactory } from "fft-api/dst";
import { versions as tsVersions } from "fft-ts/dst/api";
import { versions as cppVersions } from "fft-cpp/dst/api-js";
import { versions as wasmVersions } from "fft-cpp/dst/api-wasm";
import { versions as rustVersions } from "fft-rust/dst/api-wasm";
import { versions as mylangVersions } from "fft-mylang/dst/api";

import prefixKeys from "./prefixKeys";
import mapObject from "./mapObject";
import asPromise from "./asPromise";

export const versions: Record<string, Promise<FFTFactory>> = {
  ...prefixKeys("TJ ", mapObject(tsVersions, asPromise)),
  ...prefixKeys("CJ ", mapObject(cppVersions, func => func())),
  ...prefixKeys("CW ", mapObject(wasmVersions, func => func())),
  ...prefixKeys("RW ", mapObject(rustVersions, func => func())),
  ...prefixKeys("MW ", mapObject(mylangVersions, func => func())),
};
