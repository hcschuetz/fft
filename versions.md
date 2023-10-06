# An Overview Of The FFT Implementations

The two letters in the name prefixes give
- the implementation language
  ("C" for C/C++, "T" for TypeScript, "R" for Rust, "M" for my home-grown language)
  and
- the runtime technology
  ("N" for native, "J" for JavaScript, "W" for Web Assembly).

The native versions are available from node but not in the browser.


**fftKiss** and **fftKiss2** are wrappers for the C and C++ implementations
[kissfft](https://sourceforge.net/projects/kissfft/files/kissfft/v1_3_0/)
by Mark Borgerding.
These versions support several radices,
but only radix 2 and 4 are used in our tests/benchmarks
because our problem sizes are powers of 2.
I have added these versions to my benchmarks because
- they performed well in
  [Chris Cannam's benchmarks](https://thebreakfastpost.com/2015/10/18/ffts-in-javascript/)
  and
- they support complex input as my own versions do
  (whereas Chris Cannam is mainly interested in real-valued input).

It would also be interesting to include a version based on
[FFTW](https://www.fftw.org/).
But it's not clear how much effort this would take.

**fft_rust** uses the Rust crate
"[rustfft](https://docs.rs/rustfft/latest/rustfft/)",
which supports several algorithms.  We use the
[Radix4](https://docs.rs/rustfft/latest/rustfft/algorithm/struct.Radix4.html)
algorithm, which is optimized for powers of two.

The numbered versions are FFT implementations by myself in TypeScript and C++.
The versions with numbers in the forties to sixties support radix 2 and 4.
All other versions use radix 2.

## Notes On Some Versions

**fft01** is the most straight-forward FFT implementation
(based on the Wikipedia description of the algorithm).
It is recursive, allocates memory at runtime,
and invokes the sine and cosine functions when needed.

**fft99** is a relatively efficient radix-2 implementation.

I attempted to refine **fft01** in many small steps towards **fft99**
to see which steps are most relevant for performance.
But until now I only reached version **fft16**, which is still
quite different from **fft99**.
**fft98** is a step backward from **fft99**.

Versions with trailing letters are variations of the
corresponding versions without the letters.

**fft02** precomputes the cosines and sines.

**fft03** avoids memory allocations and data reshuffling
during the recursion for the input array.
The recursive calls get descriptions of the relevant parts
of the input and output arrays.

**fft04** does the same for the output array.

**fft05** precomputes the data shuffling, which simplifies the main recursion.

**fft08** replaces the main recursion by an iteration.
An auxiliary function `merge` is introduced in **fft07**
and removed again in **fft09** to make the recursion-to-iteration
change (from **fft07** to **fft08**) clearer.

**fft13** removes the precomputation of sines because they can be
looked up in the cosines table.
Also cosines are only precomputed for the range from 0° to 90°.
Values outside this range are mapped to this range.
(Reducing table sizes might improve cache behavior
at the cost of some extra instructions.)

In **fft40** the radix-4 steps are implemented as two layers of radix-2 steps.
**fft44** is a "real" radix-4 implementation.

**fft47** unrolls and simplifies the loop iterations using cosines of 0° and 90°.

**fft47pointers** replaces some array indexing by direct pointer arithmetics.

**fft60** has two optimizations over **fft47pointers**:
- For a pointer `p` and an integer offset `i`
  the expression `p + i` in C/C++
  is actually implemented as `p + i * sizeof(*p)`.
  **fft60** "pre-multiplies" such offsets with the sizes of the
  referenced values and thus avoids the multiplication later.
- Furthermore **fft60** duplicates the code for forward and backward
  transformations to avoid multiplications with the
  `direction` variable (`+1` or `-1`) at runtime.

(It would be interesting to see how much each of the two optimizations
contributes to the performance gain over **fft47pointers**.)

I have implemented a compiler for my own small C++ subset
to create a Web-Assembly implementation using pre-multiplication
(**MW fft60**).
But actually the pre-multiplication can also be implemented
with appropriate C++ classes (**CW fft60** and **CJ fft60**.)
So my language implementation turned out to be just an exercise in
compiler construction and in using
[binaryen](https://github.com/WebAssembly/binaryen)
to create WebAssembly code.
(Notice that the compiler is only a proof of concept.
It is just good enough to compile my **fft60** code,
where I have even avoided various syntactic sugar
to reduce the effort for the compiler implementation.)

**CW fft60** is about as fast as **MW fft60**.
It used to be slower before I replaced the complex multiplication
from the C++ standard library,
which includes some special treatment of NaN and infinity,
by a simpler implementation without that treatment.
