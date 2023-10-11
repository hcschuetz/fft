# Code performance study based on the Fast Fourier Transformation (FFT).

## TL;DR
Test and benchmark the FFT implementations at
https://hcschuetz.github.io/fft/build/.

That page also contains demo applications using the FFT:
- https://hcschuetz.github.io/fft/build#ClockworkDemo
- https://hcschuetz.github.io/fft/build#AudioDemo

## Overview

This project started as a study about efficiency of JavaScript/TypeScript (`./fft-ts/`)
but meanwhile there are also implementations in
- C/C++ (`./fft-cpp/`),
- Rust (`./fft-rust/`), and
- a basic home-grown language (`./fft-mylang`)

for comparison.

See file `versions.md` for more details about the versions.

This project only deals with complex-to-complex FFTs.

## Lessons Learned

- The implementations differ in several ways.
  Starting from a very straight-forward algorithm implemented in TypeScript,
  various optimizations have been performed, ranging from technical details
  to algorithmic changes, for example:
  - usage of typed arrays instead of plain JavaScript arrays,
  - pre-computation of cosines and sines;
  - pre-allocation of memory,
  - different ways of pre-computing of indexes,
  - usage of lower-level programming languages (C++, Rust) and
    Runtimes (WebAssembly),
  - "radix-4" instead of "radix-2" FFT algorithm,

- Using additional technologies has some costs (ability to program in
  other languages, setting up a more complex build chain, interfacing, ...)
  and it might not be needed if other optimizations lead to sufficiently
  efficient code.

  On the other hand, in addition to some extra speedup by using
  different technologies there is also a chance that
  existing optimized library code can be used
  (in our case, existing FFT libraries for C/C++ and Rust).

  This project can be seen as an example of how
  an application primarily implemented in JavaScript/TypeScript
  can delegate some performance-critical functions to WebAssembly.

- Benchmark results appear to be inconsistent at times.
  For example:
  - The performance ranking of certain (optimized) implementations
    depends on the browser used.
    Some implementations may be faster than others on Firefox
    while a different implementation may be the faster one on
    V8-based browsers.
    Occasionally even different browser versions produce different rankings.
  - Minor code changes sometimes have surprising performance impacts.
    This can, e.g., be caused by a function size crossing the limit
    up to which the optimizer inlines the function.
  - Just-in-time compilers perform optimizations on a function only
    when that function has been run a number of times.
  - Implementations scale differently.
    For example the Rust-library implementation is already very good at
    a data size of 2048,
    but it significantly outperforms other implementations
    for larger data sizes.
  - Sometimes some other processes using the CPU or
    thermal CPU throttling impact the results.

  (Some of these aspects are more of an issue for JS runtimes.
  WebAssembly code does not only tend to be faster,
  but its speed is also more consistent.)

  To get some understanding of these inconsistencies
  (in particular to distinguish random and systematic inconsistencies),
  the benchmark tool runs and displays multiple measurements for each
  implementation.
  To reduce the impact of thermal throttling, the benchmark tool can pause
  for a while before each measurement.

- ...
