use num_complex::{Complex, Complex64};
use std::f64::consts::TAU;

const ZERO_C: Complex<f64> = Complex::new(0., 0.);

pub struct FFT {
  size: usize,
}

fn recur(size: usize, input: &[Complex64], output: &mut[Complex64], direction: f64) {
  if size == 1 {
    output[0] = input[0];
  } else {
    let half_size = size / 2;
    let mut even = vec![ZERO_C; half_size];
    let mut odd  = vec![ZERO_C; half_size];
    for k in 0..half_size {
      even[k] = input[2 * k    ];
      odd [k] = input[2 * k + 1];
    }
    let mut even_out = vec![ZERO_C; half_size];
    let mut odd_out  = vec![ZERO_C; half_size];
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
