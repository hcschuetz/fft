#ifndef FFT99B_HPP
#define FFT99B_HPP 1

#include "complex.h++"

class FFT {
  unsigned int n;
  double* cosines;
  unsigned int* permute;

public:
  FFT(unsigned int n);
  ~FFT();

  void run(const Complex* f, Complex* out, int direction = 1) const;
};

#endif
