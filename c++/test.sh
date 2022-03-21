#!/usr/bin/env sh

if test "${TECH}" = C -o  "${TECH}" = ""
then
  TECH=C
  outdir=dst_c
  base_tech=native
  main_files='src/test.c src/c_bindings.c++'
  # In this case (${TECH} = C) the actual FFT implementation is still in C++.
  # It's just the test code that is in C, using the C-language bindings.
elif test "${TECH}" = C++
then
  outdir=dst_c++
  base_tech=native
  main_files=' src/fft01.c++ src/test.c++'
elif test "${TECH}" = JS
then
  outdir=dst_js
  base_tech=web
  wasm=0
elif test "${TECH}" = WASM
then
  outdir=dst_wasm
  base_tech=web
  wasm=1
else
  echo 'Variable TECH should be empty, "C", "C++", "JS" or "WASM"'
  exit 1
fi

mkdir -p ${outdir}

if test $# -eq 0
then
  args=src/fft[0-9]*.c++
else
  args="$@"
fi

for arg in ${args}
do
  version=$(basename $arg .c++)
  echo === ${TECH} ${version} ===
  cat >src/selectImpl.h++ <<EOT
#ifndef FFT_IMPL
#define FFT_IMPL 1

#include "${version}.h++"

#define FFTImpl FFT${version#fft}

#endif
EOT
  if test "${base_tech}" = native
  then
    if test "${NOCOMP}" = true; then true; else
      if test "${TECH}" = C++ -a "${version}" = fft01
      then source=    # avoid duplicate source file
      else source="src/${version}.c++"
      fi
      g++ -std=c++17 -O4 -o ${outdir}/test_${version} \
        ${main_files} \
        ${source}
    fi \
    && \
    ${outdir}/test_${version}
  elif test "${base_tech}" = web
  then
    if test "${NOCOMP}" = true; then true; else
      emcc \
        -o ${outdir}/${version}.js \
        -std=c++17 \
        -s MODULARIZE=1 \
        -s WASM=${wasm} \
        -s FILESYSTEM=0 \
        -s EXPORTED_FUNCTIONS=_malloc,_free,_prepare_fft,_run_fft,_delete_fft \
        -s EXPORTED_RUNTIME_METHODS=setValue,getValue \
        -O3 \
        src/${version}.c++ src/c_bindings.c++
    fi \
    && \
    node test.mjs ${outdir}/${version}.js
  fi
done
