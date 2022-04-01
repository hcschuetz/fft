const mapObject =
  <T, U>(obj: Record<string, T>, f: (x: T, k: string, obj: Record<string, T>) => U): Record<string, U> =>
    Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, f(v, k, obj)]));

export default mapObject;
