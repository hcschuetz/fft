mod fft_rust; use fft_rust::FFT;
use num_complex::Complex;
use anyhow::{Context, Result};

fn main() -> Result<(), Box<dyn std::error::Error>> {
  use std::io::{stdin, Read};
  use std::time::Instant;

  let mut s = String::new();
  stdin().read_to_string(&mut s)?;
  let mut iter = s.split_whitespace();

  let n_calls  : u32   = iter.next().context("number of calls expected")?.parse()?;
  let direction: i32   = iter.next().context("direction expected"      )?.parse()?;
  let size     : usize = iter.next().context("data size expected"      )?.parse()?;

  let mut input = vec![Complex{re: 0., im: 0.}; size];
  let mut output = input.clone();

  for i in 0..size {
    input[i].re = iter.next().with_context(|| format!("input[{}].re expected", i))?.parse()?;
    input[i].im = iter.next().with_context(|| format!("input[{}].im expected", i))?.parse()?;
  }

  // For some reason fft_rust::FFT is mutated while fft01::FFT and fft47::FFT
  // are not.  So we declare fft as mutable and suppress the warning when this
  // is not needed.  (Alternatively I could try to hide the mutability of
  // fft_rust as "internal mutability".  But that's beyond my current skills.)
  #[allow(unused_mut)]
  let mut fft = FFT::prepare(size);

  // eprintln!("run {} FFTs of size {}", n_calls, size);
  let start = Instant::now();
  for _ in 0..n_calls {
    fft.run(&mut input, &mut output, direction);
  }
  let end = Instant::now();
  let total_time = end.duration_since(start).as_secs_f64();
  // eprintln!("total time: {} s; per call: {} µs; calls/s: {}",
  //   total_time,
  //   total_time / n_calls as f64 * 1e6,
  //   n_calls as f64 / total_time,
  // );

  println!("{:e}", total_time);
  for i in 0..size {
    println!("{:e} {:e}", output[i].re, output[i].im);
  }

  Ok(())
}
