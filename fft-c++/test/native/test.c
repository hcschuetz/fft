#include <stdlib.h>
#include <stdio.h>
#include "fft.h"

int main() {
  int direction;
  const unsigned int n;
  struct Complex *f, *out;

  scanf("%d", &direction);
  scanf("%u", &n);
  f = malloc(n * sizeof(Complex));
  out = malloc(n * sizeof(Complex));
  for (unsigned int i = 0; i < n; i++) {
    scanf("%lf %lf", &f[i].re, &f[i].im);
  }

  FFT* fft = prepare_fft(n);
  run_fft(fft, f, out, direction);
  delete_fft(fft);

  for (unsigned int i = 0; i < n; i++) {
    printf("%.20e %.20e\n", out[i].re, out[i].im);
  }

  free(f);
  free(out);

  return 0;
}