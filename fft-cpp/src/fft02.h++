#ifndef FFT02_HPP
#define FFT02_HPP 1

#include "complex.h++"
#include "fft.h++"

class FFT02 : public FFT {
  unsigned int n;
  const Complex* rotations;

  void recur(int len, const Complex* f, Complex* out, int direction) const;

public:
  FFT02(unsigned int n);
  virtual ~FFT02();

  virtual void run(const Complex* f, Complex* out, int direction = 1) const;
};

#endif
