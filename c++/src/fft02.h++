#ifndef FTT02_HPP
#define FTT02_HPP 1

#include "complex.h++"
#include <math.h>

namespace fft02 {

const double TAU = 6.2831853071795864769;

class FFT {
  unsigned int n;
  const Complex* rotations;

  void recur(int len, const Complex* f, Complex* out, int direction) const {
    if (len == 1) {
      out[0] = f[0];
    } else {
      const int rStride = -direction * n / len;
      const int half_len = len / 2;
      Complex even[half_len];
      Complex odd [half_len];
      for (unsigned int k = 0; k < half_len; k++) {
        even[k] = f[2 * k    ];
        odd [k] = f[2 * k + 1];
      }
      Complex even_out[half_len];
      Complex odd_out [half_len];
      recur(half_len, even, even_out, direction);
      recur(half_len, odd , odd_out , direction);
      for (unsigned int k = 0; k < half_len; k++) {
        Complex e = even_out[k];
        Complex o = odd_out [k];
        Complex rotated = o * rotations[(k * rStride) & (n-1)];
        out[k           ] = e + rotated;
        out[k + half_len] = e - rotated;
      }
    }
  }

public:
  FFT(unsigned int n) {
    Complex* rotations = new Complex[n];
    for (unsigned int i = 0; i < n; i++) {
      rotations[i] = expi(TAU * i / n);
    }

    this->n = n;
    this->rotations = rotations;
  }

  ~FFT() {
    delete this->rotations;
  }

  void run(const Complex* f, Complex* out, int direction = 1) const {
    recur(this->n, f, out, direction);
  }

};

}

#endif
