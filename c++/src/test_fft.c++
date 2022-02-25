#include <math.h>
#include <iostream>
#include <iomanip>
#include <time.h>

#include "complex.h++"
#include "fft01.h++"
#include "selectVersion.h++"

const unsigned int randomDepth = 1 << 20;
const unsigned int randomDepthMask = randomDepth - 1;
const double randomDepthDouble = 1.0 * randomDepth;

double randomDouble() {
  return (random() & randomDepthMask) / randomDepthDouble;
}

Complex randomComplex() {
  return Complex(randomDouble(), randomDouble());
}

void compare(const char* label, unsigned int n, Complex* a, Complex* b, double scale_a = 1.0, double scale_b = 1.0) {
  double sum = 0;
  for (unsigned int i = 0; i < n; i++) {
    sum += (a[i] * scale_a - b[i] * scale_b).norm();
  }
  std::cout << label << ": " << sqrt(sum / n) << std::endl;
}

void display(const char* label, unsigned int m, unsigned int n, Complex* data) {
  std::cout << label << ":" << std::endl;;
  std::cout << std::showpos << std::fixed << std::setprecision(4) << std::showpoint;
  unsigned int k = 0;
  for (unsigned int i = 0; i < m; i++) {
    for (unsigned int j = 0; j < n; j++) {
      std::cout << "  " << std::setw(8) << data[k].real() << "#" << std::setw(8) << data[k].imag();
      k++;
    }
    std::cout << std::endl;
  }
}

void test() {
  const unsigned int n = 1 << 5;
  double scale = 1.0 / n;

  fft01::FFT fft01(n);
  fftOtherNS::FFT fftOther(n);

  Complex f[n];
  for (unsigned int i = 0; i < n; i++) {
    f[i] = randomComplex();
  }

  Complex out01[n];
  fft01.run(f, out01);
  Complex outOther[n];
  fftOther.run(f, outOther);
  compare("other vs. 01             ", n, outOther, out01);

  Complex invOut01[n];
  fft01.run(out01, invOut01, -1);
  Complex invOutOther[n];
  fftOther.run(outOther, invOutOther, -1);
  compare("ifft*fft (other vs. 01)  ", n, invOutOther, invOut01, scale, scale);
  compare("ifft*fft (other) vs.input", n, invOutOther, f, scale);
  std::cout << "(tests with n = " << n << ")" << std::endl;

  // display("f", 4, 8, f);
  // display("out01", 4, 8, out01);
  // display("invOut01", 4, 8, invOut01);
}

void benchmark() {
  const unsigned int warmup = 500; // Does a warmup make a difference?
  const unsigned int repeat = 2000;
  const unsigned int n = 1 << 11;

  fft01::FFT fft01(n);
  fftOtherNS::FFT fftOther(n);

  Complex f[n];
  for (unsigned int i = 0; i < n; i++) {
    f[i] = randomComplex();
  }

  Complex out[n];

  for (unsigned int i = 0; i < warmup; i++) {
    fftOther.run(f, out);
  }
  clock_t start = clock();
  for (unsigned int i = 0; i < repeat; i++) {
    fftOther.run(f, out);
  }
  clock_t end = clock();
  double time_per_run_in_s = (end-start) * 1.0 / (CLOCKS_PER_SEC * repeat);
  std::cout << time_per_run_in_s * 1e6 << " µs ("
            << 1.0 / time_per_run_in_s << " / s) with n = "
            << n << std::endl;
}

int main() {
  std::cout << "### " << fftVersionName << " ###" << std::endl;
  test();
  benchmark();
  return 0;
}
