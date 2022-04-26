double_o nMask = double_o(n-1);
complex_o n_co = complex_o(n);

int quarterN = n >> 2;
double_o quarterN_do = double_o(quarterN);
complex_o quarterN_co = complex_o(quarterN);

complex_p outputEnd = output + n_co;

complex_p o = output;
complex_p_p shuffledEnd = shuffled + complex_p_o(quarterN);
complex_p_p p = shuffled;
while (p < shuffledEnd) {
  complex_p q = *p;

  complex b0 = *q; q += quarterN_co;
  complex b2 = *q; q += quarterN_co;
  complex b1 = *q; q += quarterN_co;
  complex b3 = *q;

  complex c0 =       b0 + b1;
  complex c1 =       b0 - b1;
  complex c2 =       b2 + b3;
  complex c3 = rot90(b2 - b3);

  *o = c0 + c2; ++o;
  *o = c1 + c3; ++o;
  *o = c0 - c2; ++o;
  *o = c1 - c3; ++o;

  ++p;
}

int len = 8;
double_o rStride = double_o(-direction * (n >> 3));
while (len < n) {
  complex_o halfLen_co = complex_o(len >> 1);
  // We have pulled out and simplified the case k = 0.
  // TODO Also pull out the case k = quarterLen_co?
  // r1, r2, and r3 will be -1/8, -2/8, and -3/8 of a full turn, which
  // allows to simplify the expressions for b1, b2, and b3.
  // (But it will not get as simple as the case k = 0.  So I am not sure
  // if it is worthwhile.)
  {
    complex_p o = output;
    while (o < outputEnd) {
      complex_p o0 = o; o += halfLen_co;
      complex_p o1 = o; o += halfLen_co;
      complex_p o2 = o; o += halfLen_co;
      complex_p o3 = o; o += halfLen_co;

      complex b0 = *o0;
      complex b1 = *o1;
      complex b2 = *o2;
      complex b3 = *o3;

      complex c0 =       b0 + b1;
      complex c1 =       b0 - b1;
      complex c2 =       b2 + b3;
      complex c3 = rot90(b2 - b3);

      *o0 = c0 + c2;
      *o1 = c1 + c3;
      *o2 = c0 - c2;
      *o3 = c1 - c3;
    }
  }
  double_o rStride1 = rStride >> 1;
  double_o rStride2 = rStride;
  double_o rStride3 = rStride2 + rStride1;
  double_o rOffset1 = rStride1;
  double_o rOffset2 = rStride2;
  double_o rOffset3 = rStride3;
  complex_o k = complex_o(1);
  while (k < halfLen_co) {
    complex r1 = complex(
      *(cosines + (               rOffset1  & nMask)),
      *(cosines + ((quarterN_do - rOffset1) & nMask))
    );
    rOffset1 += rStride1;
    complex r2 = complex(
      *(cosines + (               rOffset2  & nMask)),
      *(cosines + ((quarterN_do - rOffset2) & nMask))
    );
    rOffset2 += rStride2;
    complex r3 = complex(
      *(cosines + (               rOffset3  & nMask)),
      *(cosines + ((quarterN_do - rOffset3) & nMask))
    );
    rOffset3 += rStride3;
    complex_p o = output + k;
    while (o < outputEnd) {
      complex_p o0 = o; o += halfLen_co;
      complex_p o1 = o; o += halfLen_co;
      complex_p o2 = o; o += halfLen_co;
      complex_p o3 = o; o += halfLen_co;

      complex b0 = *o0;
      complex b1 = *o1 * r2;
      complex b2 = *o2 * r1;
      complex b3 = *o3 * r3;

      complex c0 =       b0 + b1;
      complex c1 =       b0 - b1;
      complex c2 =       b2 + b3;
      complex c3 = rot90(b2 - b3);

      *o0 = c0 + c2;
      *o1 = c1 + c3;
      *o2 = c0 - c2;
      *o3 = c1 - c3;
    }

    ++k;
  }

  len = len << 2;
  rStride = rStride >> 2;
}
if (len == n) {
  // If we come here, n is not a power of 4 (but still a power of 2).
  // So we need to run one extra round of 2-way butterflies.
  complex_o halfLen_co = complex_o(len >> 1);
  complex_o quarterLen_co = complex_o(len >> 2);
  {
    complex_p o0 = output;
    complex_p o1 = o0 + halfLen_co;

    complex z0 = *o0;
    complex z1 = *o1;

    *o0 = z0 + z1;
    *o1 = z0 - z1;
  }
  {
    complex_p o0 = output + quarterLen_co;
    complex_p o1 = o0 + halfLen_co;

    complex z0 =       *o0 ;
    complex z1 = rot90(*o1);

    *o0 = z0 + z1;
    *o1 = z0 - z1;
  }
  complex_p o0 = output;
  complex_p o1 = o0 + halfLen_co;
  double_o rOffset = double_o(0);
  complex_p limit = output + halfLen_co;
  complex_p innerLimit = output + quarterLen_co;
  while (innerLimit <= limit) {

    // skip o0 == output and o0 == output + quarterLen_co,
    // which are unrolled and simplified above:
    rOffset += rStride; ++o0; ++o1;

    while (o0 < innerLimit) {
      complex r = complex(
        *(cosines + (               rOffset  & nMask)),
        *(cosines + ((quarterN_do - rOffset) & nMask))
      );
      rOffset += rStride;

      complex z0 = *o0;
      complex z1 = *o1 * r;

      *o0 = z0 + z1; ++o0;
      *o1 = z0 - z1; ++o1;
    }
    innerLimit += quarterLen_co;
  }
}
