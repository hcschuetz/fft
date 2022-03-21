#include <stdio.h>
#include <math.h>
#include <time.h>
#include "fft.h"

const unsigned int LOG2_RANDOM_LIMIT = 20;
const unsigned int RANDOM_LIMIT = 1 << LOG2_RANDOM_LIMIT;
const unsigned int RANDOM_MASK = RANDOM_LIMIT - 1;
const double RANDOM_SCALE = 1.0 / RANDOM_LIMIT;

double randomDouble() {
  return (random() & RANDOM_MASK) * RANDOM_SCALE;
}

Complex randomComplex() {
  return Complex(randomDouble(), randomDouble());
}

double time2double(timespec* tp) {
  return tp->tv_sec + 1e-9 * tp->tv_nsec;
}

int main() {
  const unsigned int n = 1 << 11;

  Complex a0[n];
  Complex a1[n];
  Complex a2[n];

  for (unsigned int i = 0; i < n; i++) {
    a0[i] = randomComplex();
  }

  FFT* fft = prepare_fft(n);
  run_fft(fft, a0, a1,  1);
  run_fft(fft, a1, a2, -1);
  delete_fft(fft);

  const double scale = 1.0 / n;
  double sum = 0.0;
  for (unsigned int i = 0; i < n; i++) {
    sum += (a2[i] * scale - a0[i]).norm();
  }
  printf("ifft*fft: %g\n", sqrt(sum/n));


  const unsigned int block_size = 2000;
  const unsigned int n_blocks = 10;
  
  const clockid_t clock = CLOCK_REALTIME;
  // const clockid_t clock = CLOCK_PROCESS_CPUTIME_ID;

  fft = prepare_fft(n);

  for (unsigned int j = 0; j < n_blocks; j++) {
    timespec start, end;
    clock_gettime(clock, &start);
    for (unsigned int k = 0; k < block_size; k++) {
      run_fft(fft, a0, a1,  1);
    }
    clock_gettime(clock, &end);
    double time = (time2double(&end) - time2double(&start)) / block_size;
    printf("%.3f %d\n", time * 1e6, (int) (1.0 / time));
  }

  delete_fft(fft);

  return 0;
}