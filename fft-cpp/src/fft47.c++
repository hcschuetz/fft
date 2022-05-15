#include "fft47.h++"
#include "complex.h++"
#include "fallbackFFT.h++"
#include <math.h>

const double TAU = 6.2831853071795864769;

FFT::FFT(unsigned int n) {
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

FFT::~FFT() {
  delete cosines;
  delete permute;
}

void FFT::run(const Complex* f, Complex* out, int direction) const {
  const unsigned int n = this->n;
  fallbackFFT(n, f, out);
  double* const cosines = this->cosines;
  unsigned int* const permute = this->permute;

  const unsigned int nMask = n - 1;
  const unsigned int quarterN = n >> 2;
  const double negDirection = -direction;

#define rotation(x) Complex(cosines[(x) & nMask], cosines[(quarterN - (x)) & nMask])

  for (unsigned int out_offset = 0; out_offset < n;) {
    unsigned int offset = permute[out_offset >> 2];
    const Complex b0 = f[offset]; offset += quarterN;
    const Complex b2 = f[offset]; offset += quarterN;
    const Complex b1 = f[offset]; offset += quarterN;
    const Complex b3 = f[offset];

    const Complex c0 =       b0 + b1;
    const Complex c1 =       b0 - b1;
    const Complex c2 =       b2 + b3;
    const Complex c3 = rot90(b2 - b3) * negDirection;

    out[out_offset++] = c0 + c2;
    out[out_offset++] = c1 + c3;
    out[out_offset++] = c0 - c2;
    out[out_offset++] = c1 - c3;
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
      for (unsigned int out_offset = 0; out_offset < n;) {
        unsigned int i0 = out_offset; out_offset += halfLen;
        unsigned int i1 = out_offset; out_offset += halfLen;
        unsigned int i2 = out_offset; out_offset += halfLen;
        unsigned int i3 = out_offset; out_offset += halfLen;

        const Complex b0 = out[i0];
        const Complex b1 = out[i1];
        const Complex b2 = out[i2];
        const Complex b3 = out[i3];

        const Complex c0 =       b0 + b1;
        const Complex c1 =       b0 - b1;
        const Complex c2 =       b2 + b3;
        const Complex c3 = rot90(b2 - b3) * negDirection;

        out[i0] = c0 + c2;
        out[i1] = c1 + c3;
        out[i2] = c0 - c2;
        out[i3] = c1 - c3;
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
      for (unsigned int out_offset = k; out_offset < n;) {
        unsigned int i0 = out_offset; out_offset += halfLen;
        unsigned int i1 = out_offset; out_offset += halfLen;
        unsigned int i2 = out_offset; out_offset += halfLen;
        unsigned int i3 = out_offset; out_offset += halfLen;

        const Complex b0 = out[i0];
        const Complex b1 = out[i1] * r2;
        const Complex b2 = out[i2] * r1;
        const Complex b3 = out[i3] * r3;

        const Complex c0 =       b0 + b1;
        const Complex c1 =       b0 - b1;
        const Complex c2 =       b2 + b3;
        const Complex c3 = rot90(b2 - b3) * negDirection;

        out[i0] = c0 + c2;
        out[i1] = c1 + c3;
        out[i2] = c0 - c2;
        out[i3] = c1 - c3;
      }
    }
  }
  if (len == n) {
    // If we come here, n is not a power of 4 (but still a power of 2).
    // So we need to run one extra round of 2-way butterflies.
    const unsigned int halfLen = len >> 1;

    // TODO Roll this back into the following loop?
    // Saving a single complex multiplicatin is probably not worth the extra code.
    {
      const Complex z0 = out[0      ];
      const Complex z1 = out[halfLen];

      out[0      ] = z0 + z1;
      out[halfLen] = z0 - z1;
    }
    int rOffset = -rStride;
    for (unsigned int k0 = 1, k1 = halfLen + 1; k0 < halfLen; k0++, k1++) {
      const Complex r = rotation(rOffset); rOffset -= rStride;

      const Complex z0 = out[k0];
      const Complex z1 = out[k1] * r;

      out[k0] = z0 + z1;
      out[k1] = z0 - z1;
    }
  }

#undef rotation

}

#include "c_bindings.c++"
