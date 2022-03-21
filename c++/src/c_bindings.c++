#include "fft.h"
#include "selectImpl.h++"

extern "C" {
  FFT* prepare_fft(unsigned int n) {
    return new FFTImpl(n);
  }

  void run_fft(FFT* fft, Complex* input, Complex* output, int direction) {
    fft->run(input, output, direction);
  }

  void delete_fft(FFT* fft) {
    delete fft;
  }
}
