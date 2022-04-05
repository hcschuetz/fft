#include <math.h>
#include <iostream>
#include <iomanip>
#include <memory>
#include <random>
#include <stdlib.h>
#include <time.h>
#include <string>
#include <vector>
#include <unistd.h>

#include "complex.h++"
#include "fft01.h++"
#include "fft.h++"
#include "fft.h"

std::mt19937 generator(1234);
std::uniform_real_distribution distribution(0.0, 1.0);

double randomDouble() {
  return distribution(generator);
}

Complex randomComplex() {
  return Complex(randomDouble(), randomDouble());
}

unsigned int scanUInt(const char* s) {
  unsigned int n;
  if (sscanf(s, "%u", &n) < 1) {
    throw "scanUInt failed";
  }
  return n;
}

bool isPowerOf2(unsigned int n) {
  return !(n & (n - 1));
}

unsigned int scanPowerOf2(const char* s) {
  unsigned int n = scanUInt(s);
  if (!isPowerOf2(n)) {
    throw "SIZES should consist of powers of 2";
  }
  return n;
}

void getSizes(std::vector<unsigned int> &out) {
  const char* SIZES = getenv("SIZES");
  if (!SIZES || !*SIZES) {
    SIZES = "4,8,512,2048";
  }
  const char* last = SIZES;
  for (const char* next = SIZES; *next; next++) {
    if (*next == ',') {
      out.insert(out.end(), scanPowerOf2(last));
      last = ++next;
    }
  }
  out.insert(out.end(), scanPowerOf2(last));
}

unsigned int getBlockSize() {
  const char* BLOCK_SIZE = getenv("BLOCK_SIZE");
  if (!BLOCK_SIZE || !*BLOCK_SIZE) {
    // Running just 2000 times would require a higher-resolution clock.
    return 20000;
  }
  return scanUInt(BLOCK_SIZE);
}

unsigned int getNBlocks() {
  const char* N_BLOCKS = getenv("N_BLOCKS");
  if (!N_BLOCKS || !*N_BLOCKS) {
    return 2;
  }
  return scanUInt(N_BLOCKS);
}

unsigned int getPause() {
  const char* PAUSE = getenv("PAUSE");
  if (!PAUSE || !*PAUSE) {
    return 0.0;
  }
  return scanUInt(PAUSE);
}

int main() {
  try {
    std::vector<unsigned int> sizes;
    getSizes(sizes);

    unsigned int blockSize = getBlockSize();
    unsigned int nBlocks = getNBlocks();
    unsigned int pause = getPause();


    // for (std::vector<unsigned int>::iterator i = sizes.begin(); i < sizes.end(); i++) {
    //   std::cout << *i << std::endl;
    // }
    // std::cout << blockSize << " " << nBlocks << " " << pause << std::endl;

    for (std::vector<unsigned int>::iterator size_it = sizes.begin(); size_it < sizes.end(); size_it++) {
      unsigned int n = *size_it;
      std::cout << "---- n = " << n << " ----" << std::endl;

      std::unique_ptr<FFT> fft(prepare_fft(n));

      Complex f[n];
      for (unsigned int i = 0; i < n; i++) {
        f[i] = randomComplex();
      }

      Complex out[n];

      for (unsigned int b = 0; b < nBlocks; b++) {
        sleep(pause);
        clock_t start = clock();
        for (unsigned int i = 0; i < blockSize; i++) {
          fft->run(f, out);
        }
        clock_t end = clock();
        double time_per_run_in_s = (end-start) * 1.0 / (CLOCKS_PER_SEC * blockSize);
        printf("%8.3f µs; %10.0f calls/s;\n",
          time_per_run_in_s * 1e6,
          1.0 / time_per_run_in_s
        );
      }
    }
  } catch (const char* e) {
    std::cerr << "Exception caught: " << e << std::endl;
    return 1;
  }
  return 0;
}
