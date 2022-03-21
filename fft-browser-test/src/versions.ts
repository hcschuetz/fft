// TODO factor out common functionality with ../../js/src/test/versions.js?

import { ComplexArray, makeComplexArray } from "fft/dst/complex/ComplexArray.js";

const specialVersions: {
  [k: string]:
    (size: number, direction?: number) =>
      Promise<(data: ComplexArray) => ComplexArray>
} = {
  fft01: async (size: number, direction: number = 1) => {
    let { fft } = await import("fft/dst/fft/fft01.js");
    return (data: ComplexArray) => fft(data, direction);
  },
  fft02: async (size: number, direction: number = 1) => {
    const { fft_prepare } = await import("fft/dst/fft/fft02.js");
    const fft_run = fft_prepare(size);
    return (data: ComplexArray) => fft_run(data, direction);
  },
  fft03: async (size: number, direction: number = 1) => {
    let { fft_prepare } = await import("fft/dst/fft/fft03.js");
    const fft_run = fft_prepare(size);
    return (data: ComplexArray) => fft_run(data, direction);
  },
}

const getFunc = (name: string) => async(size: number, direction: number = 1) => {
  let { fft_prepare } = await import(`fft/dst/fft/${name}.js`);
  const fft_run = fft_prepare(size, direction);
  const out = makeComplexArray(size);
  return (data: ComplexArray) => {
    fft_run(data, out, direction);
    return out;
  }
};

const parseVersions = (versionsRaw: string) =>
  versionsRaw.split(/^=====+/m).map(versionInfo => {
    const {head, comment} =
      versionInfo.trim()
      .match(/^(?<head>[^\r\n]*)(?:(?:\r\n|\r|\n)(?<comment>[^]*))?$/)?.groups!;
    const [actions, name, ...basedOn] = head.trim().split(/:/);
    return {
      actions, name, basedOn, comment,
      func: specialVersions[name] ?? getFunc(name),
    };
  });

export async function getIndexedVersions() {
  // magic incantation to get the contents of fft/versions.txt in a browser
  const versionsRaw = await (await fetch(require('fft/versions.txt'))).text();
  const versions = parseVersions(versionsRaw);
  return Object.fromEntries(versions.map(v => [v.name, v]));
}
