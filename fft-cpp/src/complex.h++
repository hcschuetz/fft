#ifndef COMPLEX_HPP
#define COMPLEX_HPP 1

#include <complex>

template <class T>
std::complex<T> rot90(const std::complex<T>& z) {
  return std::complex<T>(-z.imag(), z.real());
}

template <class T>
std::complex<T> expi(T theta) {
  return std::complex<T>(cos(theta), sin(theta));
}

typedef std::complex<double> Complex;

// Override the operator from std::complex because
// (in emscripten/clang's std lib)
// - that operator is not always inlined
// - and it does some special NaN/infinity handling that we do not want
//   for performance reasons
inline Complex operator*(const Complex& x, const Complex& y) {
  double x_re = x.real(), x_im = x.imag();
  double y_re = y.real(), y_im = y.imag();
  return Complex(x_re * y_re - x_im * y_im, x_re * y_im + x_im * y_re);
}

#endif
