Embedding a specialized language in C++
=======================================

In some other sub-project I am (for exploratory purposes) creating WebAssembly
code without relying on a third-party compiler.  It still turned out to be
useful to separate the algorithm description (such as FFT functionality) from
the technicalities of generating WebAssembly.

So I defined a language for the algorithm and I am writing a compiler from that
language to WebAssembly.

For debugging that approach it is helpful to know whether a bug is in the
algorithm or in the compiler.  This is the purpose of some of the code here.

My language is a small subset of C++ and it relies on predefined types,
functions, and parameters provided by the compiler.  Here in this file I embed
the algorithm implementation in actual C++ code providing the required
environment.  (Types and functions are defined in file `mylang.h++`, parameters
are provided near the beginning of method `FFT60::run(...)` in file
`fft60.c++`.)

So if the C++ FFT implementation (in `mylang-fft60.c++`) works correctly (and
it does!), we can be quite confident that the algorithm is correct.  An error in
the generated WebAssembly is then probably due to a bug in my compiler.


A note on pre-multiplying pointer offsets
-----------------------------------------

Given a pointer `p` and an integer `i` the C/C++ expression `p + i` actually
computes `(long) p + i * sizeof(*p)`, which introduces an additional
multiplication.  (The sizes we are using happen to be powers of 2.  This allows
to replace the multiplication with a left shift.  But still there is an extra
operation.)  When an offset `i` is used several times, the repeated
multiplications are sometimes optimized away by compilers, but not always.

So I experimented with an approach using "offset types" for pointers.
My restricted pointer type does not support adding integers.  It only allows to
add offsets of the appropriate type.  Integers must be converted to offsets
explicitly.  This way we have to state explicitly at which point the
multiplication with the size of the referenced type occurs.

There are two possible implementations for offsets:
- The offset value can be represented internally in units of the size of the
  referenced type.  This is the C-like behavior.
- The offset value can be represented internally in units of bytes.  The
  multiplication with the size of the referenced type happens upon creation of
  an offset instance, not when it is added to a pointer.  This is the
  "pre-multiplied" approach.

The code in `mylang.h++` supports both modes (selected by the C preprocessor).
Notice that most operations have the same implementation in the two modes.

Actually pre-multiplied pointer offsets were one of the reasons for starting my
own WebAssembly generation.  The fact that pre-multiplied pointers can be
implemented in C++ makes this particular reason void.
