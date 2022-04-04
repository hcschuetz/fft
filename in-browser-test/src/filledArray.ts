const filledArray = <T,>(length: number, f: (i: number) => T): T[] =>
  Array.from({length}, (_, i) => f(i));

export default filledArray;
