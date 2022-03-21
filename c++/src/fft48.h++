#ifndef FTT48_HPP
#define FTT48_HPP 1

#include "complex.h++"
#include "fft.h++"

class FFT48 : public FFT {
  unsigned int n;
  double* cosines;
  unsigned int* permute;

public:
  FFT48(unsigned int n);
  virtual ~FFT48();

  virtual void run(const Complex* f, Complex* out, int direction = 1) const;
};

#endif
