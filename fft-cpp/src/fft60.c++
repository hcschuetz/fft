// See the explanation in `README-mylang.md`.

#include "fft60.h++"
#include "complex.h++"
#include "fallbackFFT.h++"
#include <math.h>

const double TAU = 6.2831853071795864769;

FFT60::FFT60(unsigned int n) {
  double* cosines = new double[n];
  for (unsigned int i = 0; i < n; i++) {
    cosines[i] = cos(TAU * i / n);
  }

  const unsigned int quarterN = n >> 2;
  unsigned int* permute = new unsigned int[quarterN];
  for (unsigned int i = 0; i < quarterN; i++) {
    permute[i] = 0;
  }
  for (unsigned int len = quarterN, fStride = 1; len > 1; len >>= 1, fStride <<= 1) {
    unsigned int halfLen = len >> 1;
    for (unsigned int out_offset = 0; out_offset < quarterN; out_offset += len) {
      unsigned int limit = out_offset + len;
      for (unsigned int out_offset_odd = out_offset + halfLen; out_offset_odd < limit; out_offset_odd++) {
        permute[out_offset_odd] += fStride;
      }
    }
  }

  this->n = n;
  this->cosines = cosines;
  this->permute = permute;
  this->old_f = 0;
  this->shuffledArray = new complex_p[n >> 2];
}

FFT60::~FFT60() {
  delete cosines;
  delete permute;
  delete shuffledArray;
}

void FFT60::run(const Complex* f, Complex* out, int direction) const {
  const unsigned int n = this->n;
  fallbackFFT(n, f, out);

// -----------------------------------------------------------------------------
// Interface adaptation

  double_p const cosines(this->cosines);

  unsigned int* const permute = this->permute;

  complex_p* shuffledArray = this->shuffledArray;
  // We are caching the shuffledArray, assuming that the pointer f to the input
  // data will normally not change between calls.
  if (f != this->old_f) {
    // For caching purposes we break the constness of this FFT instance:
    const_cast<FFT60*>(this)->old_f = f;
    int quarterN = n >> 2;
    for (int i = 0; i < quarterN; i++) {
      // Here we do not really break constness, but my stripped-down language
      // does not support const types:
      shuffledArray[i] = complex_p(const_cast<Complex*>(&f[permute[i]]));
    }
  }
  complex_p_p shuffled(shuffledArray);

  const complex_p output(out);

  // The code in my stripped-down language is actually embedded twice:
  // - with rot90 doing a right rotation by 90° (multiplication by -i)
  //   as needed by the forward  FFT,
  // - with rot90 doing a left  rotation by 90° (multiplication by +i)
  //   as needed by the backward FFT.
  // This way we need not take the direction into account upon each rotation,
  // at the cost of larger code.

  if (direction > 0) {
#define rot90 rot90_right
#include "mylang-fft60.c++"
#undef rot90
  } else {
#define rot90 rot90_left
#include "mylang-fft60.c++"
#undef rot90
  }
}
