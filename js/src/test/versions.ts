import { ComplexArray, makeComplexArray } from "../complex/ComplexArray.js";
import { readFileSync } from "fs";

type Func =
  (size: number, direction?: number) =>
    Promise<(data: ComplexArray) => ComplexArray>;

const specialVersions: Record<string, Func> = {
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

const getFunc = (name: string): Func => async(size: number, direction: number = 1) => {
  let { fft_prepare } = await import(`../fft/${name}.js`);
  const fft_run = fft_prepare(size, direction);
  const out = makeComplexArray(size);
  return (data: ComplexArray) => {
    fft_run(data, out, direction);
    return out;
  }
};

const versionsRaw = readFileSync("./versions.txt", "utf-8");

export type Version = {
  actions: string,
  name: string,
  basedOn: string[],
  comment: string,
  func: Func,
};

export const versions: Version[] = versionsRaw.split(/^=====+/m).map(versionInfo => {
  const {head, comment} =
    versionInfo.trim()
    .match(/^(?<head>[^\r\n]*)(?:(?:\r\n|\r|\n)(?<comment>[^]*))?$/)?.groups!;
  const [actions, name, ...basedOn] = head.trim().split(/:/);
  return {
    actions, name, basedOn, comment,
    func: specialVersions[name] ?? getFunc(name),
  };
});

export const indexedVersions: Record<string, Version> =
  Object.fromEntries(versions.map(v => [v.name, v]));
