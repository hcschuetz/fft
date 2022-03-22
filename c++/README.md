# FFT Implementations

This directory (actually `./src/`) contains a few implementations of the
Fast Fourier Transformation (FFT) in C++.  These are not meant to compete with
existing high-speed FFT implementations.  They have been written for comparison
with the corresponding JavaScript implementations and to see how close a
C++-to-JavaScript or C++-to-WebAssembly compiler can come to native code
regarding efficiency.

TODO: Some optimizations assume that the problem sizes are not extremely small
(such as 1, 2 or 4) and the corresponding implementations do not work correctly
for such small problems.  We should check for small-sized problems and fall back
to another implementation in that case.

## Running Tests

*The script `test.mjs` assumes that you have `g++` and `emcc` installed and in your PATH.*
*It works on Linux and probably needs some tweaking on Windows.*

Call the node script `test.mjs` without arguments to compile and run all the fft
implementations:

    ./test.mjs

or

    node test.mjs

Alternatively pass as arguments the names of those fft implementations you
want to compile and run:

    ./test.mjs fft01 fft02

You can set the environment variable NOCOMP to `true` to omit the compilation
and to run the existing binary/binaries:

    NOCOMP=true ./test.mjs fft02 fft02 fft02

runs fft02 three times without compilation.

Similarly NORUN=true omits the execution (in case you only want to compile).

You can select one of the 4 ways of compilation/invokation described below by
setting the environment variable TECH to `C++`, `C`, `JS` or `WASM`.
For example:

    TECH=WASM ./test.mjs src/fft44.c++

The default method is `JS`.

## API

Each implementation provides a class derived from an abstract class `FFT`.

- The constructor is invoked with the size `n` of the FFT task, which must be
  a power of 2.
- The `run` method takes
  - an input array and an output array (both consisting of `n` complex numbers)
    and
  - a `direction` parameter, which should be 1 for a normal ("forward") FFT or
    -1 for an inverse FFT (IFFT).  This parameter is optional and defaults to 1.

To really get the inverse of the forward FFT, all the complex numbers in the
result of an IFFT need to be divided by `n`.  This "downscaling" is not done by
the `run` method itself.

In all implementations except for the most straight-forward ones the
constructor precomputes

- a table of complex unit roots or cosine values and
- a "permutation table" for rearranging the fields of the input vector into
  the output vector

to avoid computation effort during the `run` phase.

## Test And Benchmark Code

The FFT implementations can be tested and benchmarked in 4 ways:

- "`C++`":
  compiled to native code and invoked from some C++ code.
- "`C`":
  compiled to native code and invoked from some C code through a C language
  binding.
- "`JS`":
  compiled to JavaScript and invoked from some JavaScript code.
- "`WASM`":
  compiled to WebAssembly (+ some JavaScript wrapper code) and invoked from the
  same JavaScript code as in the previous case.

The calling code performs both correctness tests and benchmarks.

The input for tests and benchmarks is created from pseudo-random values.

Notice that the test/benchmarking code in C, C++, and JS (the latter also used
for WASM) differ in what tests/benchmarks they are actually executing.

### Tests

The correctness tests compare

- the FFT result with the FFT result of the "reference implementation"
  `fft01.h++`,
- the result of applying IFFT to the FFT output with the corresponding result
  using `fft01.h++`,
- the result of applying IFFT (with downscaling) to the FFT output with the
  original input.

Each comparison computes some overall "distance" between the two given complex
vectors.  For a correct implementation these distances should be in the order
of numeric precision (around 10<sup>-16</sup>).
In most cases we do not get a distance of exactly 0 due to roundoff differences.

### Benchmarks

The benchmark invokes the FFT (only the `run` method, always on the same `FFT`
instance) a number of times and displays

- the average CPU time consumed by a single run (in microseconds) and
- the number of runs that would fit in one second of CPU time according to this
  running time.

Several such "blocks" of calls may be executed and measured separately.
