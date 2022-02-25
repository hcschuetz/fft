# FFT in JavaScript

This folder contains a series of implementations of the Fast Fourier
Transformation (FFT) in JavaScript or actually in Typescript.  The purpose of
this effort was to gain some experience with performance optimization in
JavaScript without sacrificing too much of the code's readability.

Most of the implementations are based on the radix-2 algorithm and a few are
radix-4.

The series starts with `fft01`, an extremely straight-forward implementation
of the radix-2 implementation.  Other implementations improve on this step by
step, either by algorithm modifications or by lower-level technical tweaks.


## Lessons Learned

For now, I have tested the implementations in nodejs, which uses Google's v8 JS
engine.  (Browser-based tests should follow as well as an integration with
[Chris Cannam's benchmarks](https://thebreakfastpost.com/2015/10/18/ffts-in-javascript/).)

Here are some of the things I have learned about v8 and its quite aggressive
optimizer "Turbofan".
My findings are primarily based on test runs of size 2<sup>11</sup> = 2048
using a particular computer.

One reason for publishing multiple implementations instead of selecting a single
"best" version is that you can figure out which version is best for your
use case.


### Low-Hanging Fruit

As is frequently the case, most of the optimization potential came from very few
code transformations, namely

- precomputing unit roots (or cosines) and
- switching from a recursive to an iterative implementation,
  based on a precomputed permutation.

(And actually switching from a "flat" Discrete Fourier Transformation (DFT) to
the hierarchical FFT is already an optimization, but that is out of scope here.)


### Objects For Compound Data

It is possible to keep compound data (in our case: complex numbers) in
JS objects at no performance cost.  If the JS code is sufficiently
"well-behaved", the compiler is able to create code that avoids the overhead
of creating and garbage-collecting lots of objects.  It can even assign
processor registers to object components (in our case the real and imaginary
components of complex numbers).


### Inlining

The compiler does a good job of inlining functions.  In particular this allows
us to keep the code readable by using auxiliary functions for basic complex
arithmetics.  (Actually I used functional-style implementations, where for
example multiplication is implemented by a top-level function taking two
complex numbers as arguments and returning the result.  I guess that v8 is
also able to optimize object-oriented implementations where the multiplication
is implemented as a method of the complex-number class, using `this` as the
implicit first argument.)


### Unexpected Slowdowns

It turns out that some code modifications intended to increase efficiency
actually make the code slower.  (Examples: switching from radix-2 to radix-4;
certain loop unrolling transformations.)  It looks like some resource gets
exhausted due to the enlarged code, but it needs to be clarified what this is.
Is some code size limit reached causing v8 to stop inlining?  Are we running
out of registers? (Having a look at the generated assembly code it seems like
these are not really the problems.)  Is it some processor cache that
overflows?  Or ...?  Or is the code just written in a silly way?


### Currying

Most of the FFT implementations here use
"[Currying](https://en.wikipedia.org/wiki/Currying)".
The "outer" function performs some precomputations that can be done without
knowing the actual FFT input values.  It then returns an "inner" function
which performs the actual FFT using the precomputed values.
The inner function is then invoked many times with the actual input data.

v8 handles this very well.  It even treats some constant variables from the
outer function like literal values in the compiled inner function.

However, it also turned out that calling the outer function another time
invalidates some of the optimization assumptions about the inner function,
causing v8 to de-optimize the inner function and thus slowing down execution
quite significantly.


### Bounds Checking

JavaScript guarantees that array accesses (to Float64Array in our case) outside
the actual range of indexes are detected and handled properly.
A straight-forward implementation compares the index with the lower bound
(in JavaScript always 0) and the upper bound.

Turbofan seems to detect that our indexes are always non-negative.  So the check
with the lower bound can be avoided.

Furthemore the "butterfly" or "merging" steps of FFT use each index twice:
one read and one write access.  At least for some code versions Turbofan
detects this and avoids the bounds check for the second access.

I have tried to avoid the bounds checks altogether:

- The compiler might determine that the index is ok by analyzing the respective
  loops.
- We can replace `a[i]` by `a[i % n]` (`n` being the size of `a`) to ensure
  that the index is not beyond the upper bound.
- Since our array sizes are powers of 2 we can also use `a[i & (n-1)]`
  (with precomputed `n-1`) instead of `a[i % n]`, which might be slightly faster
  on some processors.
  (Notice that the unit roots or cosines are periodic and thus the masking of
  indices makes sense algorithmically anyway.)

However, none of these attempts caused Turbofan to remove all the bounds checks.


### Comparison With Native Implementations

For comparison I have ported some of the implementations to C++.
(See folder `../c++`.)

It turns out that the fastest JS implementations are still slower than the
fastest C++ implementations, but not that much.

On the other hand the speed of the C++ code is much more reliable.
In particular the switch from radix-2 to radix-4 did cause some speedup
rather than a slowdown.  Also the de-optimization problem mentioned above
does not occur for C++.

So the JS code needs to be used more carefully if efficiency is important.
(On the other hand, the C++ code also needs to be handled with care as it is
the programmer's responsibility to avoid out-of-bounds array accesses.)

Furthermore the compiled C++ code is fully optimized from the beginning whereas
the JS code is only optimized after a number of runs when the JS engine thinks
that an optimization is worthwhile.

TODO: Compile the C++ code to WASM (or even to JS?) to see how this behaves.
