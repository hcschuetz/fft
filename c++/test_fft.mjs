import { performance } from 'perf_hooks';

const jsModule = "./" + process.argv[2];

const scale = ([re, im], x) => [re * x, im * x];
const diff = ([x_re, x_im], [y_re, y_im]) => [x_re - y_re, x_im - y_im];
const norm = ([re, im]) => re * re + im * im;

const sumToN = (n, func) => {
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += func(i);
  }
  return sum;
};


const n = 1 << 11;
const block_size = 2000;
const n_blocks = 10;

async function main() {
  const factory = (await import(jsModule)).default;
  const instance = await factory();
  // console.log(instance);

  const scalarType = "double";
  const scalarSize = 8;
  const complexSize = 2 * scalarSize;

  const withMemory = (size, code) => {
    const memory = instance._malloc(size);
    try {
      code(memory);
    } finally {
      instance._free(memory);
    }
  };

  const withFFT = (n, code) => {
    const fft = instance._prepare_fft(n);
    try {
      code(fft);
    } finally {
      instance._delete_fft(fft);
    }
  };

  const fft = (n, input, output, direction = 1) =>
    withFFT(n, fft => instance._run_fft(fft, input, output, direction));

  const setComplex = (array, index, [re, im]) => {
    instance.setValue(array + complexSize * index             , re, scalarType);
    instance.setValue(array + complexSize * index + scalarSize, im, scalarType);
  }

  const getComplex = (array, index) => [
    instance.getValue(array + complexSize * index             , scalarType),
    instance.getValue(array + complexSize * index + scalarSize, scalarType),
  ];

  withMemory(n*complexSize, a0 => {
    // fill a0 with random data
    for (let i = 0; i < n; i++) {
      setComplex(a0, i, [Math.random(), Math.random()]);
    }

    withMemory(n*complexSize, a1 => {
      // correctness test:
      // applying fft and then the inverse fft (scaling down the results)
      // should return values similar to the input values.
      withMemory(n*complexSize, a2 => {
        fft(n, a0, a1,  1);
        fft(n, a1, a2, -1);
        console.log("dist:",
          Math.sqrt(sumToN(n, i => norm(diff(
                  getComplex(a0, i),
            scale(getComplex(a2, i), 1/n)
          ))) / n),
        );
      });

      // performance test:
      withFFT(n, fft => {
        for (let j = 0; j < n_blocks; j++) {
          const start = performance.now();
          for (let i = 0; i < block_size; i++) {
            instance._run_fft(fft, a0, a1, 1);
          }
          const end = performance.now();
          const timePerCall = (end - start) * 1e-3 / block_size;
          console.log((timePerCall * 1e6).toFixed(3), (1 / timePerCall).toFixed());
        }
      });
    });
  });
}

main();
