#ifndef FFT44_HPP
#define FFT44_HPP 1

#include "complex.h++"
#include "fft.h++"

class FFT44 : public FFT {
  unsigned int n;
  Complex* rotations;
  unsigned int* permute;

public:
  FFT44(unsigned int n);
  virtual ~FFT44();

  virtual void run(const Complex* f, Complex* out, int direction = 1) const;
};

#endif
