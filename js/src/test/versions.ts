import { ComplexArray, makeComplexArray } from "../complex/ComplexArray.js";
import { readFileSync } from "fs";

const specialVersions: {
  [k: string]:
    (size: number, direction?: number) =>
      Promise<(data: ComplexArray) => ComplexArray>
} = {
  fft01: async (size: number, direction: number = 1) => {
    let { fft } = await import("../fft/fft01.js");
    return (data: ComplexArray) => fft(data, direction);
  },
  fft02: async (size: number, direction: number = 1) => {
    const { fft_prepare } = await import("../fft/fft02.js");
    const fft_run = fft_prepare(size);
    return (data: ComplexArray) => fft_run(data, direction);
  },
  fft03: async (size: number, direction: number = 1) => {
    let { fft_prepare } = await import("../fft/fft03.js");
    const fft_run = fft_prepare(size);
    return (data: ComplexArray) => fft_run(data, direction);
  },
}

const getFunc = (name: string) => async(size: number, direction: number = 1) => {
  let { fft_prepare } = await import(`../fft/${name}.js`);
  const fft_run = fft_prepare(size, direction);
  const out = makeComplexArray(size);
  return (data: ComplexArray) => {
    fft_run(data, out, direction);
    return out;
  }
};

const versionsRaw: string = readFileSync("./versions.txt", "utf-8"); 

export const versions = versionsRaw.split(/^=====+/m).map(versionInfo => {
  const {head, comment} =
    versionInfo.trim()
    .match(/^(?<head>[^\r\n]*)(?:(?:\r\n|\r|\n)(?<comment>[^]*))?$/)?.groups!;
  const [actions, name, ...basedOn] = head.trim().split(/:/);
  return {
    actions, name, basedOn, comment,
    func: specialVersions[name] ?? getFunc(name),
  };
});

export const indexedVersions = Object.fromEntries(versions.map(v => [v.name, v]));
