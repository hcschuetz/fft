#ifndef MYLANG_HXX
#define MYLANG_HXX 1

#include "complex.h++"

// Simulate the built-in types and functions of my stripped-down language
// See the explanation in `README-mylang.md`.

typedef Complex complex;

inline complex rot90_right(complex z) { return complex( z.imag(), -z.real()); }
inline complex rot90_left (complex z) { return complex(-z.imag(),  z.real()); }

template<class T>
class Offset;

template<class T>
class Pointer {
  T* p;

public:
  Pointer() { this->p = 0;}
  Pointer(T* p) { this->p = p; }
  T& operator*() { return *p; }

  Pointer<T> operator+(Offset<T> that) const { return that + *this; }
  bool operator<(Pointer that) const { return p < that.p; }
  void operator=(Pointer<T> that) { this->p = that.p; }
  void operator+=(Offset<T> o) { *this = o + *this; }
  void operator++() { p++; }

  bool operator==(Pointer<T> that) { return p == that.p; }
  bool operator!=(Pointer<T> that) { return p != that.p; }
  bool operator< (Pointer<T> that) { return p <  that.p; }
  bool operator<=(Pointer<T> that) { return p <= that.p; }
  bool operator> (Pointer<T> that) { return p >  that.p; }
  bool operator>=(Pointer<T> that) { return p >= that.p; }

  friend class Offset<T>;
};

template<class T>
class Offset {
  long o;

  // The dummy parameter exists only to distinguish this private constructor
  // (needed for internal purposes) from the public constructor below.
  Offset(long i, bool dummy) { o = i; }

public:
  Offset() { o = 0; }

  Offset<T> operator+(Offset<T> that) const { return Offset(o + that.o, true); }
  Offset<T> operator-(Offset<T> that) const { return Offset(o - that.o, true); }
  Offset<T> operator&(Offset<T> that) const { return Offset(o & that.o, true); }
  Offset<T> operator<<(long i) const { return Offset(o << i, true); }
  Offset<T> operator>>(long i) const { return Offset(o >> i, true); }
  Offset<T> operator*(long i) const { return Offset(o * i, true); }

  // These return void in analogy to my language, where assignments are
  // statements rather than expressions.  (To keep things simple.)
  void operator=(Offset<T> that) { o = that.o; }
  void operator+=(Offset<T> that) { o += that.o; }
  void operator-=(Offset<T> that) { o -= that.o; }
  void operator<<=(long i) { o <<= i; }
  void operator>>=(long i) { o >>= i; }
  void operator*=(long i) { o *= i; }

  bool operator==(Offset<T> that) { return o == that.o; }
  bool operator!=(Offset<T> that) { return o != that.o; }
  bool operator< (Offset<T> that) { return o <  that.o; }
  bool operator<=(Offset<T> that) { return o <= that.o; }
  bool operator> (Offset<T> that) { return o >  that.o; }
  bool operator>=(Offset<T> that) { return o >= that.o; }

#define PRE_MULTIPLIED 1
#ifdef PRE_MULTIPLIED

  Offset(long i) { o = i * sizeof(T); }

  Pointer<T> operator+(Pointer<T> that) const {
    return Pointer<T>((T*) ((char*) that.p + o));
  }
  void operator++() { o += sizeof(T); }

#else

  Offset(long i) { o = i; }

  Pointer<T> operator+(Pointer<T> that) const {
    return Pointer(that.p + o);
  }
  void operator++() { ++o; }

#endif
};

typedef Pointer<complex>     complex_p;
typedef Offset <complex>     complex_o;
typedef Pointer<complex_p>   complex_p_p;
typedef Offset <complex_p>   complex_p_o;
typedef Pointer<double>      double_p;
typedef Offset <double>      double_o;

#endif
