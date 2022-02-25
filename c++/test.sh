#!/usr/bin/env sh

mkdir -p dst

if test $# -eq 0
then
  args=src/fft*.h++
else
  args="$@"
fi

for arg in ${args}
do
  version=$(basename $arg .h++)

  if test "${NOCOMP}" = true
  then
    dst/test_${version}
  else
    cat >src/selectVersion.h++ <<EOT
#include "${version}.h++"
#define fftOtherNS ${version}
#define fftVersionName "${version}"
EOT
    g++ -O4 -o dst/test_${version} src/test_fft.c++ && \
    dst/test_${version}
  fi
done
