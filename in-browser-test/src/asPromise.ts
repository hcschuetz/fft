const asPromise = <T>(x: T): Promise<T> => new Promise(resolve => resolve(x));

export default asPromise;
