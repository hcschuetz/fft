#ifndef FFT_KISS2_HPP
#define FFT_KISS2_HPP 1

#include "complex.h++"

#include "../thirdparty/kiss_fft130/kissfft.hh"

class FFT {
  kissfft<double>* forward;
  kissfft<double>* backward;

public:
  FFT(unsigned int n);
  ~FFT();

  void run(const Complex* f, Complex* out, int direction = 1) const;
};

#endif
