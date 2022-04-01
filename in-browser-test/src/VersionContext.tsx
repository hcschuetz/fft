import { createContext, FC, useContext, useEffect, useState } from "react";
import { Complex } from "complex/dst/Complex";
import mapObject from "./mapObject";

/**
 * A uniform API for FFT implementations hiding the representation
 * of input and output arrays.
 * For performance tests the `run` method can be called multiple times on the
 * same input and output.  This way no time is spent on data conversion to a
 * particular format used by the underlying implementation.
 */
export type TestableFFT = {
  readonly size: number,
  setInput(i: number, value: Complex): void,
  run(direction?: number): void,
  getOutput(i: number): Complex,
}

/**
 * An implementation of this type essentially represents an FFT version.
 */
export type TestableFFTFactory = (size: number) => TestableFFT;
export type PromisedVersions = Record<string, Promise<TestableFFTFactory>>;

type PromiseState<T,> =
  { status: "pending" }
| { status: "resolved", value: T }
| { status: "rejected", reason: any };

type VersionState = PromiseState<TestableFFTFactory>;
type VersionStates = Record<string, VersionState>;

const VersionContext = createContext<VersionStates>({});

export const VersionProvider : FC<{versions: PromisedVersions}> =
  ({versions, children}) => {
  const [versionStates, setVersionStates] =
    useState<VersionStates>(mapObject(versions, () => ({ status: "pending" })));
  useEffect(() => {
    for (const [name, version] of Object.entries(versions)) {
      version.then(
        value   => setVersionStates(old => ({...old, [name]: { status: "resolved", value  }})),
        reason  => setVersionStates(old => ({...old, [name]: { status: "rejected", reason }})),
      )
    }
  }, [versions]);
  return(
    <VersionContext.Provider value={versionStates}>
      {children}
    </VersionContext.Provider>
  );
};

export const useVersions = () => useContext(VersionContext);
