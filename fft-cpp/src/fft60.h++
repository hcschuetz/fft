#ifndef FFT60_HPP
#define FFT60_HPP 1

#include "complex.h++"
#include "fft.h++"
#include "mylang.h++"

class FFT60 : public FFT {
  unsigned int n;
  double* cosines;
  unsigned int* permute;

  const Complex* old_f;
  complex_p* shuffledArray;

public:
  FFT60(unsigned int n);
  virtual ~FFT60();

  virtual void run(const Complex* f, Complex* out, int direction = 1) const;
};

#endif
