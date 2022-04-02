#ifndef FFT99B_HPP
#define FFT99B_HPP 1

#include "complex.h++"
#include "fft.h++"

class FFT99b : public FFT {
  unsigned int n;
  double* cosines;
  unsigned int* permute;

public:
  FFT99b(unsigned int n);
  virtual ~FFT99b();

  virtual void run(const Complex* f, Complex* out, int direction = 1) const;
};

#endif
