#ifndef FFT_HXX
#define FFT_HXX 1

#include "complex.h++"

class FFT {
public:
  virtual ~FFT() {};
  virtual void run(const Complex* f, Complex* out, int direction = 1) const = 0;
};

#endif