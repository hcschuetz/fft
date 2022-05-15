#include "fft01.h++"
#include "complex.h++"
#include <math.h>

const double TAU = 6.2831853071795864769;

void FFT::recur(int len, const Complex* f, Complex* out, int direction) const {
  if (len == 1) {
    out[0] = f[0];
  } else {
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
      Complex rotated = o * expi(-direction * TAU * k / len);
      out[k           ] = e + rotated;
      out[k + half_len] = e - rotated;
    }
  }
}

FFT::FFT(unsigned int n) {
  this->n = n;
}

void FFT::run(const Complex* f, Complex* out, int direction) const {
  recur(n, f, out, direction);
}

#include "c_bindings.c++"
