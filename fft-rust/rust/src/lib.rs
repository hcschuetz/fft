mod fft_rust; use fft_rust::FFT;

mod utils;

use wasm_bindgen::prelude::*;
use num_complex::{Complex, Complex64};
use num_traits::identities::zero;


// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub struct FFTAPI {
  fft: FFT,
  input: Vec<Complex64>,
  output: Vec<Complex64>,
}

#[wasm_bindgen]
impl FFTAPI {
  pub fn new(size: usize) -> Self {
    utils::set_panic_hook();
    FFTAPI{
      fft: FFT::prepare(size),
      input: vec![zero(); size],
      output: vec![zero(); size],
    }
  }

  pub fn set_input(&mut self, i: usize, re: f64, im: f64) {
      self.input[i] = Complex{re, im}
  }

  // We might not want to call set_input() for each value.
  pub fn input_start(&mut self) -> *mut num_complex::Complex64 {
    self.input.as_mut_ptr()
  }

  pub fn run(&mut self, direction: i32) {
    self.fft.run(&mut self.input, &mut self.output, direction)
  }

  pub fn get_output_re(&self, i: usize) -> f64 {
    self.output[i].re
  }

  pub fn get_output_im(&self, i: usize) -> f64 {
    self.output[i].im
  }

  pub fn output_start(&self) -> *const num_complex::Complex64 {
    self.output.as_ptr()
  }
}
