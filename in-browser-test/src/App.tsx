import prefixKeys from "./prefixKeys";
import mapObject from "./mapObject";
import asPromise from "./asPromise";

import { versions as tsVersions } from "fft-ts/dst/api";
import { versions as cppVersions } from "fft-cpp/dst/api-js";
import { PromisedVersions, VersionProvider } from './VersionContext';

import Tests from './Tests';
import Benchmark from './Benchmark';
import UserAgent from './UserAgent';
import { versions as wasmVersions } from "fft-cpp/dst/api-wasm";


const versions: PromisedVersions = {
  ...prefixKeys("TJ\u00a0", mapObject(tsVersions, asPromise)),
  ...prefixKeys("CJ\u00a0", cppVersions),
  ...prefixKeys("CW\u00a0", wasmVersions),
};

function App() {
  return (
    <VersionProvider versions={versions}>
      <h1>Comparing FFT Implementation Variants</h1>
      <p>
        See <a href="https://github.com/hcschuetz/fft/">
          the GitHub repository
        </a> for more information.
      </p>
      <h2>Tests</h2>
      <Tests/>
      <h2>Benchmarks</h2>
      <Benchmark/>
      <h2>User Agent</h2>
      <p>
        This page is currently being displayed by the following browser:
        <br/>
        <code><UserAgent/></code>
      </p>
    </VersionProvider>
  );
}

export default App;
