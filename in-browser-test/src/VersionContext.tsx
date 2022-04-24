import { createContext, FC, useContext, useEffect, useState } from "react";
import mapObject from "./mapObject";
import { FFTFactory } from "fft-api/dst";


export type PromisedVersions = Record<string, Promise<FFTFactory>>;

export type PromiseState<T,> =
  { status: "pending" }
| { status: "resolved", value: T }
| { status: "rejected", reason: any };

export type VersionState = PromiseState<FFTFactory>;
export type VersionStates = Record<string, VersionState>;

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
