
// TODO integrate this with tests for c++?

import { performance } from 'perf_hooks'; // needed for node 14; not needed for node 16
import { timesScalar, minus, abs2 } from './sut/complex/Complex.js';
import { getComplex, makeComplexArray, setComplex } from './sut/complex/ComplexArray.js';


const sumToN = (n : number, func: (x: number) => number) => {
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += func(i);
  }
  return sum;
};

async function main() {
  // TODO make these configurable via environment variables:
  const n = 1 << 11;
  const block_size = 2000;
  const n_blocks = 3;
  // TODO optionally make a pause between blocks?
  
  const jsModule = process.argv[2];  
  console.log(`----- testing ${jsModule} -----`);
  const { fft_prepare } = await import("./" + jsModule);
  const fft = fft_prepare(n);

  const a0 = makeComplexArray(n);
  const a1 = makeComplexArray(n);
  const a2 = makeComplexArray(n);

  for (let i = 0; i < n; i++) {
    setComplex(a0, i, {re: Math.random(), im: Math.random()});
  }

  // correctness test:
  // applying fft and then the inverse fft (scaling down the results)
  // should return values similar to the input values.
  fft(a0, a1,  1);
  fft(a1, a2, -1);
  console.log("dist:",
    Math.sqrt(sumToN(n, i => abs2(minus(
                  getComplex(a0, i),
      timesScalar(getComplex(a2, i), 1/n)
    ))) / n),
  );

  // performance test:
  for (let j = 0; j < n_blocks; j++) {
    const start = performance.now();
    for (let i = 0; i < block_size; i++) {
      fft(a0, a1, 1);
    }
    const end = performance.now();
    const timePerCall = (end - start) * 1e-3 / block_size;
    console.log((timePerCall * 1e6).toFixed(3), (1 / timePerCall).toFixed());
  }
}

main();
