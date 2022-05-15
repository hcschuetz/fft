#include "complex.h++"
#include "c_bindings.h++"

#define kiss_fft_scalar double // override the default "float"
#include "../thirdparty/kiss_fft130/kiss_fft.h"

// including third-party C code here so that we need not adapt our build script:
#include "../thirdparty/kiss_fft130/kiss_fft.c"

struct FFT {
  kiss_fft_cfg forward, backward;
};

FFT* prepare_fft(unsigned int n) {
  FFT* fft = (FFT*) malloc(sizeof(FFT));
  fft->forward  = kiss_fft_alloc(n, 0, NULL, NULL);
  fft->backward = kiss_fft_alloc(n, 1, NULL, NULL);
  return fft;
}

void run_fft(FFT* fft, const Complex* input, Complex* output, int direction) {
  kiss_fft(
    direction < 0 ? fft->backward : fft->forward,
    (kiss_fft_cpx*) input,
    (kiss_fft_cpx*) output
  );
}

void delete_fft(FFT* fft) {
  free(fft->forward );
  free(fft->backward);
  free(fft);
}
