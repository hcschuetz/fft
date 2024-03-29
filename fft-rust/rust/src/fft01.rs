use num_complex::{Complex, Complex64};
use std::f64::consts::TAU;

pub struct FFT {
  size: usize,
}

// Safe variant at the cost of zero-filling.
// (Probably hard to optimize away.)
fn make_vec<T: num_traits::Zero + Clone>(size: usize) -> Vec<T> {
  vec![num_traits::zero(); size]
}

fn recur(size: usize, input: &[Complex64], output: &mut [Complex64], direction: f64) {
  if size == 1 {
    output[0] = input[0];
  } else {
    let half_size = size / 2;
    let mut even = make_vec(half_size);
    let mut odd  = make_vec(half_size);
    for k in 0..half_size {
      even[k] = input[2 * k    ];
      odd [k] = input[2 * k + 1];
    }
    let mut even_out = make_vec(half_size);
    let mut odd_out  = make_vec(half_size);
    recur(half_size, &even, &mut even_out, direction);
    recur(half_size, &odd , &mut odd_out , direction);
    for k in 0..half_size {
      let e = even_out[k];
      let o = odd_out [k];
      let rotated = o * Complex::cis(-TAU * direction * (k as f64) / (size as f64));
      output[k            ] = e + rotated;
      output[k + half_size] = e - rotated;
    }
  }
}

impl FFT {
  pub fn prepare(size: usize) -> FFT {
    FFT{size}
  }

  pub fn run(&self, input: &[Complex64], output: &mut[Complex64], direction: i32) {
    recur(self.size, input, output, direction as f64);
  }
}
