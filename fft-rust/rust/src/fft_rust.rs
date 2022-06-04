use num_complex::{Complex, Complex64};
use rustfft::{algorithm::Radix4, Fft, FftDirection};

pub struct FFT {
  forward: Radix4<f64>,
  inverse: Radix4<f64>,
  scratch: Vec<Complex64>,
}

impl FFT {
  pub fn prepare(size: usize) -> FFT {
    let forward = Radix4::new(size, FftDirection::Forward);
    let inverse = Radix4::new(size, FftDirection::Inverse);

    let scratch_len = forward.get_outofplace_scratch_len();
    assert!(inverse.get_outofplace_scratch_len() == scratch_len);

    FFT {
      forward, inverse,
      scratch: vec![Complex{re: 0., im: 0.}; scratch_len],
    }
  }

  pub fn run(&mut self, input: &mut[Complex64], output: &mut[Complex64], direction: i32) {
    (if direction > 0 { &self.forward } else { &self.inverse })
    .process_outofplace_with_scratch(input, output, &mut self.scratch)
  }
}
