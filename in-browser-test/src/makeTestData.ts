import { randomComplex } from "fft-cpp/dst/fft-instance-utils";
import filledArray from "./filledArray";

const makeTestData = (n: number) => filledArray(n, () => randomComplex());

export default makeTestData;
