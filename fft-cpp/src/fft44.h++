#ifndef FFT44_HPP
#define FFT44_HPP 1

#include "complex.h++"

class FFT {
  unsigned int n;
  Complex* rotations;
  unsigned int* permute;

public:
  FFT(unsigned int n);
  ~FFT();

  void run(const Complex* f, Complex* out, int direction = 1) const;
};

#endif
