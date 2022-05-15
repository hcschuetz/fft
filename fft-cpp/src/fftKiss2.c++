#include "fftKiss2.h++"
#include "complex.h++"
#include <math.h>

FFT::FFT(unsigned int n) {
  forward  = new kissfft<double>(n, false);
  backward = new kissfft<double>(n, true );
}

FFT::~FFT() {
  delete forward;
  delete backward;
}

void FFT::run(const Complex* f, Complex* out, int direction) const {
  kissfft<double>* p = direction < 0 ? backward : forward;
  p->transform((std::complex<double>*) f, (std::complex<double>*) out);
}

#include "c_bindings.c++"
