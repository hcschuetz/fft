#ifndef FTT47POINTERS_HPP
#define FTT47POINTERS_HPP 1

#include "complex.h++"
#include "fft.h++"

class FFT47pointers : public FFT {
  unsigned int n;
  double* cosines;
  unsigned int* permute;

public:
  FFT47pointers(unsigned int n);
  virtual ~FFT47pointers();

  virtual void run(const Complex* f, Complex* out, int direction = 1) const;
};

#endif
