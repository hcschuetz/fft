#ifndef FFT01_HPP
#define FFT01_HPP 1

#include "complex.h++"
#include "fft.h++"

class FFT01 : public FFT {
  unsigned int n;

  void recur(int len, const Complex* f, Complex* out, int direction) const;

public:
  FFT01(unsigned int n);

  virtual void run(const Complex* f, Complex* out, int direction = 1) const;
};

#endif
