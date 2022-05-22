#include <math.h>
#include <iostream>
#include <iomanip>
#include <memory>
#include <stdlib.h>

#include "complex.h++"
#include "c_bindings.h++"

int main() {
  unsigned int nCalls;
  int direction;
  unsigned int n;
  std::cin >> nCalls >> direction >> n;

  Complex f[n];
  for (unsigned int i = 0; i < n; i++) {
    double re, im;
    std::cin >> re >> im;
    f[i] = Complex(re, im);
  }

  FFT* fft = prepare_fft(n);

  Complex out[n];


  clock_t start = clock();
  for (unsigned int i = 0; i < nCalls; i++) {
    run_fft(fft, f, out, direction);
  }
  clock_t end = clock();
  double total_time = (end-start) * 1.0 / CLOCKS_PER_SEC;

  std::cout << std::setprecision(20);
  std::cout << total_time << std::endl;
  for (unsigned int i = 0; i < n; i++) {
    std::cout << out[i].real() << " " << out[i].imag() << std::endl;
  }

  delete_fft(fft);

  return 0;
}
