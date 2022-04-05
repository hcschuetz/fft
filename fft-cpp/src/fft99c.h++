#ifndef FFT99C_HPP
#define FFT99C_HPP 1

#include "complex.h++"
#include "fft.h++"

class FFT99c : public FFT {
  unsigned int n;
  double* cosines;
  unsigned int* permute;

public:
  FFT99c(unsigned int n);
  virtual ~FFT99c();

  virtual void run(const Complex* f, Complex* out, int direction = 1) const;
};

#endif
