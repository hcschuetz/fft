#ifndef FFT01_HPP
#define FFT01_HPP 1

#include "complex.h++"

class FFT {
  unsigned int n;

  void recur(int len, const Complex* f, Complex* out, int direction) const;

public:
  FFT(unsigned int n);

  void run(const Complex* f, Complex* out, int direction = 1) const;
};

#endif
