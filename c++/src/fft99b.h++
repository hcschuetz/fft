#ifndef FTT99B_HPP
#define FTT99B_HPP 1

#include "complex.h++"
#include <math.h>

namespace fft99b {

const double TAU = 6.2831853071795864769;

const unsigned int c31 = 8 * sizeof(int) - 1;

class FFT {
  unsigned int n;
  double* cosines;
  unsigned int* permute;

public:
  FFT(unsigned int n) {
    unsigned int halfN = n >> 1;
    unsigned int quarterN = n >> 2;

    double* cosines = new double[quarterN + 1];
    for (unsigned int i = 0; i <= quarterN; i++) {
      cosines[i] = cos(TAU * i / n);
    }

    unsigned int* permute = new unsigned int[halfN];
    for (unsigned int i = 0; i < halfN; i++) {
      permute[i] = 0;
    }
    for (unsigned int len = halfN, fStride = 1; len > 1; len >>= 1, fStride <<= 1) {
      unsigned int halfLen = len >> 1;
      for (unsigned int out_offset = 0; out_offset < halfN; out_offset += len) {
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

  ~FFT() {
    delete cosines;
    delete permute;
  }

  void run(const Complex* f, Complex* out, double direction = 1.0) const {
    unsigned int n = this->n;
    double* cosines = this->cosines;
    unsigned int* permute = this->permute;

    unsigned int halfN = n >> 1;
    unsigned int quarterN = n >> 2;

    for (unsigned int out_offset = 0; out_offset < n;) {
      const unsigned int i0 = permute[out_offset >> 1];
      const unsigned int i1 = i0 + halfN;

      const Complex z0 = f[i0];
      const Complex z1 = f[i1];

      out[out_offset++] = z0 + z1;
      out[out_offset++] = z0 - z1;
    }

    for (unsigned int halfLen = 2, rStride = quarterN; rStride; halfLen <<= 1, rStride >>= 1) {
      for (unsigned int out_offset = 0; out_offset < n;) {
        const unsigned int i0 = out_offset; out_offset += halfLen;
        const unsigned int i1 = out_offset; out_offset += halfLen;

        const Complex z0 = out[i0];
        const Complex z1 = out[i1];

        out[i0] = z0 + z1;
        out[i1] = z0 - z1;
      }
      int rOffset = quarterN - rStride;
      for (unsigned int k = 1; k < halfLen; k++) {
        int rSign = (rOffset >> c31) * 2 + 1;
        unsigned int rAbs = rSign * rOffset;
        Complex r(
          rSign * cosines[quarterN - rAbs],
          -direction * cosines[rAbs]
        );
        rOffset -= rStride;

        for (unsigned int out_offset = k; out_offset < n;) {
          const unsigned int i0 = out_offset; out_offset += halfLen;
          const unsigned int i1 = out_offset; out_offset += halfLen;

          const Complex z0 = out[i0];
          const Complex z1 = out[i1] * r;

          out[i0] = z0 + z1;
          out[i1] = z0 - z1;
        }
      }
    }
  }
};

}

#endif
