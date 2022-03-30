import { makeComplexArray, setComplex } from "complex/dst/ComplexArray";

export function makeTestData(n: number) {
  const result = makeComplexArray(n);
  for (let i = 0; i < n; i++) {
    setComplex(result, i, {re: Math.random(), im: Math.random()});
  }
  return result;
}
