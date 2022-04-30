import { VersionProvider } from './VersionContext';
import Tests from './Tests';
import Benchmark from './Benchmark';
import UserAgent from './UserAgent';
import { versions } from "./versions";
import { Clockwork } from './Clockwork';

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
      <h2>Demos</h2>
      <p>
        Having fulfilled our duties with the tests and benchmarks above,
        it's now time to use FFTs for something that's a bit more fun:
      </p>
      <Clockwork/>
      <h2>User Agent</h2>
      <p>
        Your browser identifies as
        <br/>
        <code><UserAgent/></code>
        <br/>
        where the highlighted part is probably the browser's actual name and version.
      </p>
    </VersionProvider>
  );
}

export default App;
