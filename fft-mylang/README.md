# FFT in WebAssembly

In my investigations how the Fast Fourier Transformation (FFT) can be
implemented efficiently with Web technologies it was obvious that a solution
based on WebAssembly had to be implemented.
I have already used `emscripten` to compile C++ code to WebAssembly
and I have also experimented with `AssemblyScript`,
but I also wanted to investigate a more direct generation of WebAssembly code.

In an earlier attempt I tried to implement JavaScript (actually TypeScript)
functions emitting higher-level abstractions as WebAssembly code (actually
as a `binaryen` module).
Based on these abstractions I described the FFT algorithm as
JavaScript/TypeScript code.
Unfortunately that code still contained many technicalities distracting
from the actual algorithm.

Therefore I separated the algorithm from the code generation even more:
I defined a minimalistic programming language using the parser generator
`peggy` (which, by the way, is a tool which I can strongly
recommend) and implemented a compiler from that language to `binaryen`.

The language is a small subset of C++.  This allows to also compile the code
with a C++ compiler and to run it for comparison/testing purposes.

So I started out to avoid the `emscripten` compiler and to directly use the
lower-level API `binaryen`, but then ended up with my own home-grown compiler.
Was it worth the effort (beyond being a training exercise for me)?
- My specialized compiler produces a very light-weight WebAssembly module.
  I still have to figure out if I can get something comparable with proper
  parameterization of `emscripten`,
  minimizing the overhead for generic C++ support.
- My compiler allows to experiment with different code-generation approaches.
  (But it turned out that the pre-multiplied address offsets described below
  can also be implemented in standard C++.  So this idea does not justify a
  home-grown compiler.)
- We still rely on `binaryen`'s optimizer.
  Creating code that does not need optimization would require a lot more effort.

My compiler has only proof-of-concept quality.
But with some testing the actual FFT implementations might be used in practice.

## A tweaked `binaryen.js` API

`binaryen` is implemented in C++ and compiled to JavaScript.
The various pointer types from C++ are all represented as numbers in JavaScript.
In the TypeScript typing all these types are therefore mapped to `number`
and thus indistinguishable in TypeScript's structural type system.

To make the types more useful I have modified the type declarations a bit.
See [src/tweaked-binaryen.d.ts](src/tweaked-binaryen.d.ts).

## On the algorithm implementation language

A program corresponds to the body of a C/C++ function.

Only a very small subset of C/C++ is supported:
- no function definitions (only some pre-defined functions)
- control structures (`if`, `while`) only as needed
- no type definitions (only some pre-defined types)
- not even type specifiers beyond type names
- no array definitions (only some pre-defined arrays)
- assignments are not expressions but statements
- dito for prefix `++` (and there is no `--` and no postfix `++`)
- ...

(For details have a look at the code.)

But we have built-in complex numbers with certain operations.

### Arrays and pointers

Since there are no type specifiers beyond type names, the C type `myType*` is
written as `myType_p`.

For now, array syntax `a[i]` is not supported.  Instead we write `*(a + i)`.

More importantly, in an expression `a + i` with a pointer value `a` of type
`myType_p` the value `i` must not be a (signed or unsigned) integer, but rather
of a special "offset type" `myType_o`.  This leaves it to the compiler to
decide if the offsets are pre-multiplied with the size of `myType` or not.
(Notice that in C whenever an integer is added to a pointer, the integer is
automatically multiplied with the size of the type referenced by the pointer.
Our offset types can hold a value that is already multiplied with the size of
the referenced type.  This saves a multiplication when the offset is applied
to a pointer.  OTOH, the size must be taken into account upon creation of an
offset.)

### Environment

#### Parameters

`n` is the number of inputs/outputs.  It must be a power of 2.

`shuffled` is an array of pointers to complex numbers.  Its elements point
into the `input` array in some permuted order.

We do not need `input` as a variable because the elements of `shuffled` already
point into the input array.

`cosines` is an array of `n` precomputed cosine values.

`output` is an array of `n` complex numbers where the calling code expects
the FFT result.

`direction` is 1 for forward FFT and -1 for backward FFT.

See the code for more details.

#### Functions

`rot90(c)` rotates the complex number `c` right by 90° (i.e., multiplies it with
`-i`) in a forward FFT and rotates it left by 90° (i.e., multiplies it with
`i`) in a backward FFT.

`complex(re, im)` creates a complex value from two `double` values.

For each offset type there is a function of the same name converting an `int`
value to the offset type.