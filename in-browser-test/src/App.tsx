import { HashProvider } from './HashProvider';
import { VersionProvider } from './VersionContext';
import { versions } from "./versions";
import Tests from './Tests';
import Benchmark from './Benchmark';
import Demos from './Demos';
import UserAgent from './UserAgent';

function App() {
  return (
    <HashProvider>
      <VersionProvider versions={versions}>
        <h1>Comparing FFT Implementation Variants</h1>
        <p>
          See <a target="_blank" rel="noreferrer" href="https://github.com/hcschuetz/fft/">
            the GitHub repository
          </a> for more information.
        </p>
        <h2>Tests</h2>
        <Tests/>
        <h2>Benchmarks</h2>
        <Benchmark/>
        <h2>Demos</h2>
        <p>
          Having fulfilled our duties with the tests and benchmarks above,
          it's now time to use FFTs for something that's a bit more fun:
        </p>
        <Demos/>
        <h2>User Agent</h2>
        <p>
          Your browser identifies as
          <br/>
          <code><UserAgent/></code>
          <br/>
          where the highlighted part is probably the browser's actual name and version.
        </p>
      </VersionProvider>
    </HashProvider>
  );
}

export default App;
