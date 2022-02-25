#ifndef FTT44_HPP
#define FTT44_HPP 1

#include "complex.h++"
#include <math.h>

namespace fft44 {

const double TAU = 6.2831853071795864769;

const unsigned int c31 = 8 * sizeof(int) - 1;

class FFT {
  unsigned int n;
  Complex* rotations;
  unsigned int* permute;

public:
  FFT(unsigned int n) {
    Complex* rotations = new Complex[n];
    for (unsigned int i = 0; i < n; i++) {
      rotations[i] = expi(TAU * i / n);
    }

    unsigned int* permute = new unsigned int[n];
    for (unsigned int i = 0; i < n; i++) {
      permute[i] = 0;
    }
    for (unsigned int len = n, fStride = 1; len > 1; len >>= 1, fStride <<= 1) {
      unsigned int halfLen = len >> 1;
      for (unsigned int out_offset = 0; out_offset < n; out_offset += len) {
        unsigned int limit = out_offset + len;
        for (unsigned int out_offset_odd = out_offset + halfLen; out_offset_odd < limit; out_offset_odd++) {
          permute[out_offset_odd] += fStride;
        }
      }
    }

    this->n = n;
    this->rotations = rotations;
    this->permute = permute;
  }

  ~FFT() {
    delete rotations;
    delete permute;
  }

  void run(const Complex* f, Complex* out, int direction = 1) const {
    const unsigned int n = this->n;
    Complex* const rotations = this->rotations;
    unsigned int* const permute = this->permute;

    for (unsigned int k = 0; k < n; k++) {
      out[k] = f[permute[k]];
    }

    const unsigned int nMask = n - 1;

    unsigned int len = 2;
    int rStride = direction * (n >> 1);
    for (; len < n; len <<= 2, rStride >>= 2) {
      const int rStride1 = rStride >> 1;
      const int rStride2 = rStride;
      const int rStride3 = rStride2 + rStride1;
      int rOffset1 = 0;
      int rOffset2 = 0;
      int rOffset3 = 0;
      const unsigned int halfLen = len >> 1;
      for (unsigned int k = 0; k < halfLen; k++) {
        const Complex r1 = rotations[rOffset1 & nMask]; rOffset1 -= rStride1;
        const Complex r2 = rotations[rOffset2 & nMask]; rOffset2 -= rStride2;
        const Complex r3 = rotations[rOffset3 & nMask]; rOffset3 -= rStride3;
        for (unsigned int out_offset = k; out_offset < n;) {
          unsigned int i0 = out_offset & nMask; out_offset += halfLen;
          unsigned int i1 = out_offset & nMask; out_offset += halfLen;
          unsigned int i2 = out_offset & nMask; out_offset += halfLen;
          unsigned int i3 = out_offset & nMask; out_offset += halfLen;

          const Complex a0 = out[i0];
          const Complex a1 = out[i1];
          const Complex a2 = out[i2];
          const Complex a3 = out[i3];

          const Complex b0 = a0;
          const Complex b1 = a1 * r2;
          const Complex b2 = a2 * r1;
          const Complex b3 = a3 * r3;

          const Complex c0  = b0 + b1;
          const Complex c1  = b0 - b1;
          const Complex c2  = b2 + b3;
          const Complex aux = b2 - b3;
          const Complex c3  = Complex(aux.imag() * direction, -aux.real() * direction);

          const Complex d0 = c0 + c2;
          const Complex d1 = c1 + c3;
          const Complex d2 = c0 - c2;
          const Complex d3 = c1 - c3;

          out[i0] = d0;
          out[i1] = d1;
          out[i2] = d2;
          out[i3] = d3;
        }
      }
    }
    if (len == n) {
      // If we come here, n is not a power of 4 (but still a power of 2).
      // So we need to run one extra round of 2-way butterflies.
      int rOffset = 0;
      const unsigned int halfLen = len >> 1;
      for (unsigned int k = 0, k1 = halfLen; k < halfLen; k++, k1++) {
        const Complex r = rotations[rOffset & nMask]; rOffset -= rStride;

        const Complex a0 = out[k ];
        const Complex a1 = out[k1];

        const Complex b0 = a0;
        const Complex b1 = a1 * r;

        const Complex c0 = b0 + b1;
        const Complex c1 = b0 - b1;

        out[k ] = c0;
        out[k1] = c1;
      }
    }
  }
};

}

#endif
