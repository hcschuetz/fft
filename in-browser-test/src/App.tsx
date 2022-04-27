import { VersionProvider } from './VersionContext';
import Tests from './Tests';
import Benchmark from './Benchmark';
import UserAgent from './UserAgent';
import { versions } from "./versions";

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
