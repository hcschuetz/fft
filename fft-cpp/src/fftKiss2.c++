#include "../thirdparty/kiss_fft130/kissfft.hh"
#include "c_bindings.h++"

struct FFT {
  kissfft<double>* forward;
  kissfft<double>* backward;
};

FFT* prepare_fft(unsigned int n) {
  FFT* fft = (FFT*) malloc(sizeof(FFT));
  fft->forward  = new kissfft<double>(n, false);
  fft->backward = new kissfft<double>(n, true );
  return fft;
}

void run_fft(FFT* fft, const Complex* input, Complex* output, int direction) {
  kissfft<double>* p = direction < 0 ? fft->backward : fft->forward;
  p->transform(input, output);
}

void delete_fft(FFT* fft) {
  delete fft->forward;
  delete fft->backward;
  free(fft);
}
