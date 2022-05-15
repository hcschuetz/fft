#include "c_bindings.h++"

extern "C" {
  FFT* prepare_fft(unsigned int n) {
    return new FFT(n);
  }

  void run_fft(FFT* fft, Complex* input, Complex* output, int direction) {
    fft->run(input, output, direction);
  }

  void delete_fft(FFT* fft) {
    delete fft;
  }
}
