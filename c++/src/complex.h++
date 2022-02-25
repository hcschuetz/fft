#ifndef COMPLEX_HPP
#define COMPLEX_HPP 1

#include <math.h>

class Complex {
  double re, im;

public:
  double real() const { return this->re; }
  double imag() const { return this->im; }

  Complex(double re, double im) {
    this->re = re;
    this->im = im;
  }

  Complex() {} // leave uninitialized like other number types

  Complex operator+(Complex that) const {
    return Complex(
      this->re + that.re,
      this->im + that.im
    );
  }

  Complex operator-(Complex that) const {
    return Complex(
      this->re - that.re,
      this->im - that.im
    );
  }

  Complex operator*(Complex that) const {
    return Complex(
      this->re * that.re - this->im * that.im,
      this->re * that.im + this->im * that.re
    );
  }

  Complex operator*(double that) const {
    return Complex(
      this->re * that,
      this->im * that
    );
  }

  /** Multiply this with i, that is, rotate this by 90° counterclockwise. */
  Complex rot90() const {
    return Complex(
      -this->im,
       this->re
    );
  }

  double norm() {
    return re*re + im*im;
  }
};

const Complex zero(0.0, 0.0);

const Complex expi(double x) {
  return Complex(cos(x), sin(x));
}

#endif
