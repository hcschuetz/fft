const prefixKeys = 
  <T>(prefix: string, obj: Record<string, T>): Record<string, T> =>
    Object.fromEntries(Object.entries(obj).map(([k, v]) => [prefix +k, v]));

export default prefixKeys;
