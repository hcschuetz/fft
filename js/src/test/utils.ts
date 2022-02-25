import { makeComplexArray, setComplex } from "../complex/ComplexArray.js";

export const makeTestData = (n: number) => {
  const data = makeComplexArray(n);
  for (let i = 0; i < n; i++) {
    setComplex(data, i, {re: Math.random(), im: Math.random()});
  }
  return data;
}
