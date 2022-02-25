# FFT Implementations

This directory (actually `./src/`) contains a few implementations of the
Fast Fourier Transformation (FFT).  These are not meant to compete with existing
high-speed FFT implementations.  They have been written for comparison with the
corresponding JavaScript implementations to see how close a JavaScript compiler
can come to C++ regarding efficiency.

All the implementations here perform complex-to-complex transformations with
problem sizes that are a power of 2.

TODO: Some optimizations assume that the problem sizes are not extremely small
(such as 1, 2 or 4) and the corresponding implementations do not work correctly
for such small problems.  We should check for small-sized problems and fall back
to another implementation in that case.

TODO: Check how fast the C++ implementations are when compiled to web assembly.

## API

Each implementation provides a class `FFT` in a namespace identifying the
version.

- The constructor is invoked with the size `n` of the FFT task, which should be
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

to avoid this effort during the `run` phase.

## Test And Benchmark Code

The program `src/test_fft.c++` performs both correctness tests and benchmarks.

For selecting an FFT implementation the program includes an auxiliary header
`src/selectVersion.h++`, which should contain something like this:

    #include "fft47.h++"
    #define fftOtherNS fft47
    #define fftVersionName "fft47"

(The script `test.sh` described below writes this file automatically before
compiling.)

The input for tests and benchmarks is created from pseudo-random values.

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

## Running Tests

*The script `test.sh` assumes that you have a Bourne shell (or bash) as well as `g++` installed.*
*Adapt that script as needed or compile and run the test program manually.*

Call the shell script `test.sh` without arguments to compile and run all the fft
implementations matching `src/fft*.h++`:

    ./test.sh

or

    sh test.sh

Alternatively pass as arguments the names of those fft implementations you
want to compile and run:

    ./test.sh src/fft01.h++ src/fft02.h++

You can set the environment parameter NOCOMP to `true` to omit the compilation
and to run the existing binary/binaries:

    NOCOMP=true ./test.sh src/fft02.h++ src/fft02.h++ src/fft02.h++

runs fft02 three times without compilation.
