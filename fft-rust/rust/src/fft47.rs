use num_complex::{Complex, Complex64};
use std::f64::consts::TAU;

pub struct FFT {
  size: usize,
  cosines: Vec<f64>,
  permute: Vec<usize>,
}

fn rot90(z: Complex64) -> Complex64 {
  Complex{re: -z.im, im: z.re}
}

impl FFT {
  pub fn prepare(size: usize) -> FFT {
    let mut cosines = vec![0.0; size];
    for i in 0..size {
      cosines[i] = (TAU * (i as f64) / (size as f64)).cos();
    }

    let quarter_size = size >> 2;
    let mut permute = vec![0 as usize; quarter_size];
    let mut len = quarter_size;
    let mut f_stride = 1;
    while len > 1 {
      let half_len = len >> 1;
      let mut out_offset: usize = 0;
      while out_offset < quarter_size {
        for out_offset_odd in (out_offset + half_len)..(out_offset + len) {
          permute[out_offset_odd] += f_stride;
        }
        out_offset += len;
      }
      len >>= 1; f_stride <<= 1;
    }

    FFT{size, cosines, permute}
  }

  pub fn run(&self, input: &[Complex64], output: &mut[Complex64], direction: i32) {
    // let FFT{
    //   size: size,
    //   cosines: cosines,
    //   permute: permute,
    // } = self;
    let size = self.size;
    let cosines = &self.cosines;
    let permute = &self.permute;

    // fallback for size <= 2
    match size {
      1 => {
        output[0] = input[0]; return;
      }
      2 => {
        let c0 = input[0];
        let c1 = input[1];
        output[0] = c0 + c1;
        output[1] = c0 - c1;
        return;
        }
      _ => {}
    }

    let mask = size - 1;
    let quarter_size = size >> 2;
    let neg_direction = -direction as f64;

    let rotation = |x| Complex::new(
      cosines[x as usize & mask],
      cosines[(quarter_size - x as usize) & mask]
    );

    let mut out_offset: usize = 0;
    while out_offset < size {
      let mut offset = permute[out_offset >> 2];
      let b0 = input[offset]; offset += quarter_size;
      let b2 = input[offset]; offset += quarter_size;
      let b1 = input[offset]; offset += quarter_size;
      let b3 = input[offset];

      let c0 = b0 + b1;
      let c1 = b0 - b1;
      let c2 = b2 + b3;
      let c3 = rot90(b2 - b3) * neg_direction;

      output[out_offset] = c0 + c2; out_offset += 1;
      output[out_offset] = c1 + c3; out_offset += 1;
      output[out_offset] = c0 - c2; out_offset += 1;
      output[out_offset] = c1 - c3; out_offset += 1;
    }

    let mut len: usize = 8;
    let mut r_stride = direction * (size as i32 >> 3);
    while len < size {
      let half_len = len >> 1;
      // We have pulled out and simplified the case k = 0.
      // TODO Also pull out the case k = quarterLen?
      // r1, r2, and r3 will be -1/8, -2/8, and -3/8 of a full turn, which
      // allows to simplify the expressions for b1, b2, and b3.
      // (But it will not get as simple as the case k = 0.  So I am not sure
      // if it is worthwhile.)
      {
        let mut out_offset = 0;
        while out_offset < size {
          let i0 = out_offset; out_offset += half_len;
          let i1 = out_offset; out_offset += half_len;
          let i2 = out_offset; out_offset += half_len;
          let i3 = out_offset; out_offset += half_len;

          let b0 = output[i0];
          let b1 = output[i1];
          let b2 = output[i2];
          let b3 = output[i3];

          let c0 = b0 + b1;
          let c1 = b0 - b1;
          let c2 = b2 + b3;
          let c3 = rot90(b2 - b3) * neg_direction;
    
          output[i0] = c0 + c2;
          output[i1] = c1 + c3;
          output[i2] = c0 - c2;
          output[i3] = c1 - c3;
        }
      }

      let r_stride1 = r_stride >> 1;
      let r_stride2 = r_stride;
      let r_stride3 = r_stride2 + r_stride1;
      let mut r_offset1 = -r_stride1;
      let mut r_offset2 = -r_stride2;
      let mut r_offset3 = -r_stride3;
      for k in 1..half_len {
        // TODO Some bit fiddling with rOffset[123] to restrict cosine lookups
        // to the first quadrant?  Then shorten the cosines array.
        let r1 = rotation(r_offset1); r_offset1 -= r_stride1;
        let r2 = rotation(r_offset2); r_offset2 -= r_stride2;
        let r3 = rotation(r_offset3); r_offset3 -= r_stride3;
        let mut out_offset = k;
        while out_offset < size {
          let i0 = out_offset; out_offset += half_len;
          let i1 = out_offset; out_offset += half_len;
          let i2 = out_offset; out_offset += half_len;
          let i3 = out_offset; out_offset += half_len;

          let b0 = output[i0];
          let b1 = output[i1] * r2;
          let b2 = output[i2] * r1;
          let b3 = output[i3] * r3;

          let c0 =       b0 + b1;
          let c1 =       b0 - b1;
          let c2 =       b2 + b3;
          let c3 = rot90(b2 - b3) * neg_direction;

          output[i0] = c0 + c2;
          output[i1] = c1 + c3;
          output[i2] = c0 - c2;
          output[i3] = c1 - c3
        }
      }
      len <<= 2; r_stride >>= 2;
    }
    if len == size {
      // If we come here, n is not a power of 4 (but still a power of 2).
      // So we need to run one extra round of 2-way butterflies.
      let half_len = len >> 1;

      // TODO Roll this back into the following loop?
      // Saving a single complex multiplicatin is probably not worth the extra code.
      {
        let z0 = output[0      ];
        let z1 = output[half_len];

        output[0      ] = z0 + z1;
        output[half_len] = z0 - z1;
      }
      let mut r_offset = -r_stride;
      for k0 in 1..half_len {
        let k1 = k0 + half_len;
        let r = rotation(r_offset); r_offset -= r_stride;

        let z0 = output[k0];
        let z1 = output[k1] * r;

        output[k0] = z0 + z1;
        output[k1] = z0 - z1;
      }
    }
  }
}
