#include "fftKiss2.h++"
#include "complex.h++"
#include <math.h>

FFTKiss2::FFTKiss2(unsigned int n) {
  forward  = new kissfft<double>(n, false);
  backward = new kissfft<double>(n, true );
}

FFTKiss2::~FFTKiss2() {
  delete forward;
  delete backward;
}

void FFTKiss2::run(const Complex* f, Complex* out, int direction) const {
  kissfft<double>* p = direction < 0 ? backward : forward;
  p->transform((std::complex<double>*) f, (std::complex<double>*) out);
}
