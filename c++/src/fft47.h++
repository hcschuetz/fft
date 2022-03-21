#ifndef FTT47_HPP
#define FTT47_HPP 1

#include "complex.h++"
#include "fft.h++"

class FFT47 : public FFT {
  unsigned int n;
  double* cosines;
  unsigned int* permute;

public:
  FFT47(unsigned int n);
  virtual ~FFT47();

  virtual void run(const Complex* f, Complex* out, int direction = 1) const;
};

#endif
