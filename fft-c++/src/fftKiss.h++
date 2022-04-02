#ifndef FFT_KISS_HPP
#define FFT_KISS_HPP 1

#include "complex.h++"
#include "fft.h++"

#define kiss_fft_scalar double // override the default "float"
#include "../thirdparty/kiss_fft130/kiss_fft.h"

class FFTKiss : public FFT {
  kiss_fft_cfg forward, backward;

public:
  FFTKiss(unsigned int n);
  virtual ~FFTKiss();

  virtual void run(const Complex* f, Complex* out, int direction = 1) const;
};

#endif
