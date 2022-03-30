#include "fft47pointers.h++"
#include "complex.h++"
#include "fallbackFFT.h++"
#include <math.h>

const double TAU = 6.2831853071795864769;

FFT47pointers::FFT47pointers(unsigned int n) {
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
}

FFT47pointers::~FFT47pointers() {
  delete cosines;
  delete permute;
}

void FFT47pointers::run(const Complex* f, Complex* out, int direction) const {
  const unsigned int n = this->n;
  fallbackFFT(n, f, out);
  double* const cosines = this->cosines;
  unsigned int* const permute = this->permute;

  const unsigned int nMask = n - 1;
  const unsigned int quarterN = n >> 2;
  const double negDirection = -direction;

#define rotation(x) Complex(cosines[(x) & nMask], cosines[(quarterN - (x)) & nMask])

  Complex* o = &out[0];
  for (const unsigned int* p = &permute[0]; p < &permute[quarterN]; p++) {
    const Complex* q = &f[*p];

    const Complex b0 = *q; q += quarterN;
    const Complex b2 = *q; q += quarterN;
    const Complex b1 = *q; q += quarterN;
    const Complex b3 = *q;

    const Complex c0 =  b0 + b1;
    const Complex c1 =  b0 - b1;
    const Complex c2 =  b2 + b3;
    const Complex c3 = (b2 - b3).rot90() * negDirection;

    *o++ = c0 + c2;
    *o++ = c1 + c3;
    *o++ = c0 - c2;
    *o++ = c1 - c3;
  }

  unsigned int len = 8;
  int rStride = direction * (n >> 3);
  for (; len < n; len <<= 2, rStride >>= 2) {
    const unsigned int halfLen = len >> 1;
    // We have pulled out and simplified the case k = 0.
    // TODO Also pull out the case k = quarterLen?
    // r1, r2, and r3 will be -1/8, -2/8, and -3/8 of a full turn, which
    // allows to simplify the expressions for b1, b2, and b3.
    // (But it will not get as simple as the case k = 0.  So I am not sure
    // if it is worthwhile.)
    {
      for (Complex* o = &out[0]; o < &out[n];) {
        Complex* o0 = o; o += halfLen;
        Complex* o1 = o; o += halfLen;
        Complex* o2 = o; o += halfLen;
        Complex* o3 = o; o += halfLen;

        const Complex b0 = *o0;
        const Complex b1 = *o1;
        const Complex b2 = *o2;
        const Complex b3 = *o3;

        const Complex c0 =  b0 + b1;
        const Complex c1 =  b0 - b1;
        const Complex c2 =  b2 + b3;
        const Complex c3 = (b2 - b3).rot90() * negDirection;

        *o0 = c0 + c2;
        *o1 = c1 + c3;
        *o2 = c0 - c2;
        *o3 = c1 - c3;
      }
    }
    const int rStride1 = rStride >> 1;
    const int rStride2 = rStride;
    const int rStride3 = rStride2 + rStride1;
    int rOffset1 = -rStride1;
    int rOffset2 = -rStride2;
    int rOffset3 = -rStride3;
    for (unsigned int k = 1; k < halfLen; k++) {
      // TODO Some bit fiddling with rOffset[123] to restrict cosine lookups
      // to the first quadrant?  Then shorten the cosines array.
      const Complex r1 = rotation(rOffset1); rOffset1 -= rStride1;
      const Complex r2 = rotation(rOffset2); rOffset2 -= rStride2;
      const Complex r3 = rotation(rOffset3); rOffset3 -= rStride3;
      for (Complex* o = &out[k]; o < &out[n];) {
        Complex* o0 = o; o += halfLen;
        Complex* o1 = o; o += halfLen;
        Complex* o2 = o; o += halfLen;
        Complex* o3 = o; o += halfLen;

        const Complex b0 = *o0;
        const Complex b1 = *o1 * r2;
        const Complex b2 = *o2 * r1;
        const Complex b3 = *o3 * r3;

        const Complex c0 =  b0 + b1;
        const Complex c1 =  b0 - b1;
        const Complex c2 =  b2 + b3;
        const Complex c3 = (b2 - b3).rot90() * negDirection;

        *o0 = c0 + c2;
        *o1 = c1 + c3;
        *o2 = c0 - c2;
        *o3 = c1 - c3;
      }
    }
  }
  if (len == n) {
    // If we come here, n is not a power of 4 (but still a power of 2).
    // So we need to run one extra round of 2-way butterflies.
    const unsigned int halfLen = len >> 1;
    const unsigned int quarterLen = len >> 2;
    {
      Complex *o0 = &out[0], *o1 = o0 + halfLen;

      const Complex z0 = *o0;
      const Complex z1 = *o1;

      *o0 = z0 + z1;
      *o1 = z0 - z1;
    }
    {
      Complex *o0 = &out[quarterLen], *o1 = o0 + halfLen;

      const Complex z0 =  *o0;
      const Complex z1 = (*o1).rot90() * negDirection;

      *o0 = z0 + z1;
      *o1 = z0 - z1;
    }
    Complex *o0 = &out[0], *o1 = o0 + halfLen;
    int rOffset = 0;
    for (Complex* limit = &out[quarterLen]; limit <= &out[halfLen]; limit += quarterLen) {
      // skip o0 == &o[0] and o0 == &out[quarterLen], which are unrolled and simplified above
      rOffset -= rStride; o0++, o1++;
      for (; o0 < limit; o0++, o1++) {
        const Complex r = rotation(rOffset); rOffset -= rStride;

        const Complex z0 = *o0;
        const Complex z1 = *o1 * r;

        *o0 = z0 + z1;
        *o1 = z0 - z1;
      }
    }
  }

#undef rotation

}