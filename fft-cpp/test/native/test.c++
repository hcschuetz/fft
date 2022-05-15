#include <math.h>
#include <iostream>
#include <iomanip>
#include <memory>
#include <stdlib.h>

#include "complex.h++"
#include "c_bindings.h++"

int main() {
  int direction;
  unsigned int n;
  std::cin >> direction >> n;

  Complex f[n];
  for (unsigned int i = 0; i < n; i++) {
    double re, im;
    std::cin >> re >> im;
    f[i] = Complex(re, im);
  }

  FFT* fft = prepare_fft(n);

  Complex out[n];
  run_fft(fft, f, out, direction);

  std::cout << std::setprecision(20);
  for (unsigned int i = 0; i < n; i++) {
    std::cout << out[i].real() << " " << out[i].imag() << std::endl;
  }

  delete_fft(fft);

  return 0;
}
