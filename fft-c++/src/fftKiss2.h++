#ifndef FFT_KISS2_HPP
#define FFT_KISS2_HPP 1

#include "complex.h++"
#include "fft.h++"

#include "../thirdparty/kiss_fft130/kissfft.hh"

class FFTKiss2 : public FFT {
  kissfft<double>* forward;
  kissfft<double>* backward;

public:
  FFTKiss2(unsigned int n);
  virtual ~FFTKiss2();

  virtual void run(const Complex* f, Complex* out, int direction = 1) const;
};

#endif
