import { abs2, Complex, minus, timesScalar } from "complex/dst/Complex";

type GetComplex = (i: number) => Complex;

export const getDist = (n: number, a: GetComplex, b: GetComplex, scale_a: number = 1, scale_b: number = 1) => {
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += abs2(minus(
      timesScalar(a(i), scale_a),
      timesScalar(b(i), scale_b),
    ));
  }
  return Math.sqrt(sum / n);
}
