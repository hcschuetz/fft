#ifndef FFT02_HPP
#define FFT02_HPP 1

#include "complex.h++"

class FFT {
  unsigned int n;
  const Complex* rotations;

  void recur(int len, const Complex* f, Complex* out, int direction) const;

public:
  FFT(unsigned int n);
  ~FFT();

  void run(const Complex* f, Complex* out, int direction = 1) const;
};

#endif
