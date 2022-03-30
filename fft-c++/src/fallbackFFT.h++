#include "complex.h++"

#define fallbackFFT(n, input, output) \
  switch (n) { \
    case 1: { \
      output[0] = input[0]; \
      return; \
    } \
    case 2: { \
      Complex c0 = input[0]; \
      Complex c1 = input[1]; \
      output[0] = c0 + c1; \
      output[1] = c0 - c1; \
      return; \
    } \
  }
