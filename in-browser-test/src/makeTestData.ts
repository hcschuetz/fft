import { randomComplex } from "complex/dst/Complex";
import filledArray from "./filledArray";

const makeTestData = (n: number) => filledArray(n, () => randomComplex());

export default makeTestData;
