#ifndef C_BINDINGS_HPP
#define C_BINDINGS_HPP 1

#include "complex.h++"

class FFT;

extern "C" {
  FFT* prepare_fft(unsigned int n);
  void run_fft(FFT* fft, const Complex* input, Complex* output, int direction = 1);
  void delete_fft(FFT* fft);
}

#endif
