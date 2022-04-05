#include "fftKiss.h++"
#include "complex.h++"
#include <math.h>

// including third-party C code here so that we need not adapt our build script:
#include "../thirdparty/kiss_fft130/kiss_fft.c"

FFTKiss::FFTKiss(unsigned int n) {
  forward  = kiss_fft_alloc(n, 0, NULL, NULL);
  backward = kiss_fft_alloc(n, 1, NULL, NULL);
}

FFTKiss::~FFTKiss() {
  free(forward );
  free(backward);
}

void FFTKiss::run(const Complex* f, Complex* out, int direction) const {
  kiss_fft(
    direction < 0 ? backward : forward,
    (kiss_fft_cpx*) f,
    (kiss_fft_cpx*) out
  );
}
