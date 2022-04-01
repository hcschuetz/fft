const filledArray = <T,>(n: number, f: (i: number) => T): T[] =>
  new Array(n).fill(undefined).map((_, i) => f(i));

export default filledArray;
