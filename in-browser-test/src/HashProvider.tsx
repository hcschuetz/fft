import { createContext, FC, useContext, useEffect, useState } from "react";

export type HashAPI = {
  hash: string,
  setHash: (v: string) => void,
  clearHash: () => void,
};

const HashContext = createContext<HashAPI>(undefined as any);

/**
 * Call this below `<HashProvider>...</HashProvider>` to get
 * - the current URL hash component (without the leading "#"),
 * - a setter function,
 * - and a function for clearing the hash.
 * Invoking `useHash()` in a component will cause re-rendering upon hash changes
 * (including changes that originated elswhere).
 */
export const useHash = (): HashAPI => useContext(HashContext);

/**
 * Wrapper class for observing/writing/clearing the hash part of `window.location`.
 * Invoke `useHash()` below this component to access the API.
 */
export const HashProvider: FC = ({children}) => {
  const [hash, setHashRaw] = useState("");

  function setHash(value: string) {
    window.location.hash = value;
  }
  function clearHash() {
    // Do not set the hash to "" because this would scroll
    // to the beginning of the page:
    window.location.hash = "-";
    // Now remove the hash (just to get a nicer URL):
    window.history.replaceState(null, "",
      window.location.pathname
      // + window.location.search // currently not needed
    );
  }

  useEffect(() => {
    const readHash = () => setHashRaw(window.location.hash.replace(/^#/, ""));
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, []);

  const api = {hash, setHash, clearHash};

  return <HashContext.Provider value={api}>{children}</HashContext.Provider>;
}
