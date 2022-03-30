import { fft_prepare as fft01_prepare } from "fft-ts/dst/fft01";
import { fft_prepare as fft02_prepare } from "fft-ts/dst/fft02";
import { fft_prepare as fft03_prepare } from "fft-ts/dst/fft03";
import { fft_prepare as fft04_prepare } from "fft-ts/dst/fft04";
import { fft_prepare as fft05_prepare } from "fft-ts/dst/fft05";
import { fft_prepare as fft06_prepare } from "fft-ts/dst/fft06";
import { fft_prepare as fft07_prepare } from "fft-ts/dst/fft07";
import { fft_prepare as fft08_prepare } from "fft-ts/dst/fft08";
import { fft_prepare as fft09_prepare } from "fft-ts/dst/fft09";
import { fft_prepare as fft10_prepare } from "fft-ts/dst/fft10";
import { fft_prepare as fft11_prepare } from "fft-ts/dst/fft11";
import { fft_prepare as fft12_prepare } from "fft-ts/dst/fft12";
import { fft_prepare as fft13_prepare } from "fft-ts/dst/fft13";
import { fft_prepare as fft14_prepare } from "fft-ts/dst/fft14";
import { fft_prepare as fft14a_prepare } from "fft-ts/dst/fft14a";
import { fft_prepare as fft14b_prepare } from "fft-ts/dst/fft14b";
import { fft_prepare as fft15_prepare } from "fft-ts/dst/fft15";
import { fft_prepare as fft15a_prepare } from "fft-ts/dst/fft15a";
import { fft_prepare as fft15b_prepare } from "fft-ts/dst/fft15b";
import { fft_prepare as fft15c_prepare } from "fft-ts/dst/fft15c";
import { fft_prepare as fft15d_prepare } from "fft-ts/dst/fft15d";
import { fft_prepare as fft16_prepare } from "fft-ts/dst/fft16";
import { fft_prepare as fft40_prepare } from "fft-ts/dst/fft40";
import { fft_prepare as fft44_prepare } from "fft-ts/dst/fft44";
import { fft_prepare as fft98_prepare } from "fft-ts/dst/fft98";
import { fft_prepare as fft98a_prepare } from "fft-ts/dst/fft98a";
import { fft_prepare as fft99_prepare } from "fft-ts/dst/fft99";
import { fft_prepare as fft99a_prepare } from "fft-ts/dst/fft99a";
import { fft_prepare as fft99b_prepare } from "fft-ts/dst/fft99b";
import { fft_prepare as fft99c_prepare } from "fft-ts/dst/fft99c";
import { FFTPrep } from "fft-ts/dst/fft_types";

export const versions: Record<string, FFTPrep> = {
  fft01: fft01_prepare,
  fft02: fft02_prepare,
  fft03: fft03_prepare,
  fft04: fft04_prepare,
  fft05: fft05_prepare,
  fft06: fft06_prepare,
  fft07: fft07_prepare,
  fft08: fft08_prepare,
  fft09: fft09_prepare,
  fft10: fft10_prepare,
  fft11: fft11_prepare,
  fft12: fft12_prepare,
  fft13: fft13_prepare,
  fft14: fft14_prepare,
  fft14a: fft14a_prepare,
  fft14b: fft14b_prepare,
  fft15: fft15_prepare,
  fft15a: fft15a_prepare,
  fft15b: fft15b_prepare,
  fft15c: fft15c_prepare,
  fft15d: fft15d_prepare,
  fft16: fft16_prepare,
  fft40: fft40_prepare,
  fft44: fft44_prepare,
  fft98: fft98_prepare,
  fft98a: fft98a_prepare,
  fft99: fft99_prepare,
  fft99a: fft99a_prepare,
  fft99b: fft99b_prepare,
  fft99c: fft99c_prepare,
  // TODO versions from C++
};
