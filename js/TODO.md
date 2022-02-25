TODO
====

✓ compile ts to a separate directory
✓ script "clean" removing that compilation directory
- documentation or explaining output text for the tests and benchmarks
- package as an npm module (.ts + (.js + .d.ts))
- document the optimization steps
- use in the Fourier demo
- test for n = 1, 2, 4 and handle as special cases if needed
  (looks like only n = 1 needs special handling)
- complete the small-step path from fft16 to fft9b.
- implement a browser UI in ./test-ui
  - running tests and benchmarks
    - graphic output (for code diffs and measured times)
    - checkboxes for switching on and off versions
  - displaying code
    (https://openbase.com/categories/js/best-react-syntax-highlighting-libraries)
    and diffs (https://www.npmjs.com/package/diff)
  - write a module (= a typescript file) with meta information about the
    versions.
    - the name of the file containing a version
    - from which other version is a version derived
    - explanation of the change (currently in comments; should go to a markdown
      string)
    - how to invoke the version (= provide a uniform API for all versions)
    - configuration for tests/benchmarks
      - versions
      - data sizes
      - sleep durations
      (dynamic imports become superfluous)
  - also display test/benchmark results from node?  would need a server;


Tuning
------

I'm benchmarking my implementations on node (currently version 16), which uses
Google's "v8" JavaScript engine from Chrome.  v8 has a quite aggressive
optimizing compiler "TurboFan" generating efficient machine code from readable
and idiomatic JavaScript.  I'm taking care to write TS/JS in a style that
TurboFan (and hopefully other JS engines) can handle efficiently.  Sometimes
it helps to have a look at the generated machine code, which can be emitted
with the node option `--print-opt-code`.

One pitfall is that some supposed optimizations actually lead to less efficient
code.  Certain manual loop-splitting transformations seem to make the code less
efficient - perhaps by overflowing a processor cache, worsened branch prediction
or by preventing some inlining in the optimizer heuristics.

I have actually tried some compiler options in nodejs (see
https://flaviocopes.com/node-runtime-v8-options/) such as

    --max-inlined-bytecode-size=2000
    --max-inlined-bytecode-size-cumulative=4000
    --max-inlined-bytecode-size-absolute=20000
    --reserve-inline-budget-scale-factor=2.0
    --stress-inline

to tune the optimization.  But
- I wasn't able to speed up the code with a few attempts and
- it anyway does not make sense to rely on this if the code is supposed to run
  in a browser where these options are not available.


Performance Comparison
----------------------

There is a review of JS FFT implementations by Chris Cannam at
https://thebreakfastpost.com/2015/10/18/ffts-in-javascript/.

The fastest implementation (for most settings) is "kissfft".  So this is the
implementation to compare with.

The review provides test code.  For kissfft it is at
https://code.soundsoftware.ac.uk/projects/js-dsp-test/repository/show/fft/kissfft
and
https://code.soundsoftware.ac.uk/projects/js-dsp-test/repository/entry/fft/test.js#L253.

Run equivalent performance tests for kissfft and my implementation.
- Run my FFT code in Chris Cannam's benchmarking framework
- or run kissfft with my benchmark
- or do both.
Both approaches make the implementations comparable.  Most importantly they will
run on the same machine.  Integrating with the Cannam framework has the added
benefit that he might integrate it in his page.

The Cannam benchmark uses kissfft with real-valued input (testKissFFT) and also
with complex-valued input (testKissFFTCC).  My code runs on complex-valued input.
How much extra tuning would be possible for real-valued input?

I have downloaded and unpacked the Cannam benchmark.  It runs as

    cd ~/prog/js/fft-cannam/js-dsp-test-223f770b5341/fft
    npx static-server

And open the root page (http://localhost:9080 or whatever static-server says)
with the browser.

It looks like my code (on node 14.15.5, still with my benchmark) has a chance
to outperform the other candidates (running in Firefox 96 or Chrome 97) in JS,
but not their native implementations.  (While these very first comparisons are
on the same hardware, we should also compare with the same JS engines.)


Optimization steps
------------------

✓ precompute sines and cosines
✓ use pre-allocated arrays (with offsets and strides in the recursion)
- replace recursion with iteration (+ permutation)
  ✓ precompute permute recursively; still run recursively
  ✓ precompute permute recursively; run iteratively
  ✓ precompute permute iteratively;
✓ just use cosines (sin(x) = cos(x - TAU/4))
✓ just use cosines and sines between 0 and TAU/4
✓ strip out certain simple cases where we can save computations (0, TAU/4)
  - done for one of the cases;
  - the unrolling needed for stripping out the other case made things slower
    (do I still have such a version?)
    ### try with an extra nested loop for 1st/2nd half.
✓ use "<< 1" for duplication and (more importantly) ">> 1" for halving integers
  (so that the compiler knows that we expect integer results)
- ...

Additional things to try:
- Do we actually need the "sign hack"?  We could split the iteration over `r` into
  two parts: One from -TAU/4 to 0 and one from 0 to TAU/4.  Within each part the
  sign is fixed.  Furthermore we could pull out the "0" step just as we already
  did for -TAU/4.  Some computations can be simplified using `cos(0) = 1` and
  `sin(0) = 0`.
  <br>
  **No, this does not work.**  Probably the loop unrolling makes the function
  too long for v8 to apply certain optimizations (inlining).
- 4-way merging.  That is, perform 2 recursion levels at once.
  This saves some set/get operations.  But the extra code complexity may imply
  performance disadvantages outweighing the savings.
- Optimizations for real-only input
- use a do-while loop when we know that there will be at least one iteration
  (probably only a minimal performance gain)

C Code
------

... is on the Linux box.  Runs about as fast as JS.

- Benchmark JS on the Linux box so that we have a fair comparison.
- Compile with emscripten to WASM and benchmark this as well.
  (Maybe compile to JS as well.)
- Port more versions (in particular one with 4-way butterflies).
