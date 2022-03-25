export type Complex = {re: number, im: number};

export const plus = (x: Complex, y: Complex): Complex => ({
  re: x.re + y.re,
  im: x.im + y.im,
});

export const minus = (x: Complex, y: Complex): Complex => ({
  re: x.re - y.re,
  im: x.im - y.im,
});

export const times = (x: Complex, y: Complex): Complex => ({
  re: x.re * y.re - x.im * y.im,
  im: x.re * y.im + x.im * y.re,
});

export const timesScalar = (x: Complex, y: number): Complex => ({
  re: x.re * y,
  im: x.im * y,
});

export const conj = (x: Complex): Complex => ({
  re: x.re,
  im: -x.im,
});

/** returns the norm (squared absolute value) of a complex number */
export const abs2 = (x: Complex): number => x.re**2 + x.im**2;

/** returns the complex value `exp(i * x) = cos(x) + i * sin(x)` for a real number x */
export const expi = (x: number): Complex => ({
  re: Math.cos(x),
  im: Math.sin(x),
});
