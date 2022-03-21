import {useEffect, useState } from 'react';
import { getIndexedVersions, Version } from './versions';
import { Tests } from './testing';
import { Benchmark } from './benchmarking';


function App() {
  const [indexedVersions, setIndexedVersions] = useState({} as Record<string, Version>);
  useEffect(() => {
    async function getVersions() {
      const indexedVersions = await getIndexedVersions();
      setIndexedVersions(indexedVersions);
    }
    getVersions();
  }, []);

  return (
    <>
      <h1>Comparing FFT Implementation Variants</h1>
      <p>
        See <a href="https://github.com/hcschuetz/fft/">
          the GitHub repository
        </a> for more information.
      </p>
      <h2>Tests</h2>
      <Tests {...{indexedVersions}}/>
      <h2>Benchmarks</h2>
      <Benchmark {...{indexedVersions}}/>
    </>
  );
}

export default App;
