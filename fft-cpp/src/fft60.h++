#ifndef FFT60_HPP
#define FFT60_HPP 1

#include "complex.h++"
#include "mylang.h++"

class FFT {
  unsigned int n;
  double* cosines;
  unsigned int* permute;

  const Complex* old_f;
  complex_p* shuffledArray;

public:
  FFT(unsigned int n);
  ~FFT();

  void run(const Complex* f, Complex* out, int direction = 1) const;
};

#endif
