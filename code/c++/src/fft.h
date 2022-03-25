#ifndef FFT_H
#define FFT_H 1

#ifdef __cplusplus
#include "complex.h++"
#include "fft.h++"
#else
struct Complex;
struct FFT;
#endif

#ifdef __cplusplus
extern "C" {
#endif

  FFT* prepare_fft(unsigned int n);
  void run_fft(FFT* fft, Complex* input, Complex* output, int direction);
  void delete_fft(FFT* fft);

#ifdef __cplusplus
}
#endif

#endif