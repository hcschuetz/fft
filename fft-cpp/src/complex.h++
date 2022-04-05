#ifndef COMPLEX_HPP
#define COMPLEX_HPP 1

#include <complex>

template <class T>
std::complex<T> rot90(const std::complex<T>& z) {
  return std::complex(-z.imag(), z.real());
}

template <class T>
std::complex<T> expi(T theta) {
  return std::complex(cos(theta), sin(theta));
}

typedef std::complex<double> Complex;

#endif
