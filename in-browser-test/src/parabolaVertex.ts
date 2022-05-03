/**
 * Fit a parabola (with vertical axis) through the three points
 * `(-1, yl)`, `(0, yc)`, `(1, yr)` and return its vertex.
 */
export default
function parabolaVertex(yl: number, yc: number, yr: number): {xv: number, yv: number} {
  // To simplify the problem we shift the points vertically by -yc:
  yl -= yc;
  yr -= yc;
  // yc = 0;

  // Now the generic parabola formula
  //   y = a*x^2 + b*x + c
  // must hold for the three points (-1, yl), (0, 0), (1, yr):
  //   yl = a - b + c
  //   0  = c
  //   yr = a + b + c
  // These three equations can be solved easily for the three variables a, b, c:
  const a = (yr + yl) / 2;
  const b = (yr - yl) / 2;
  // c = 0;

  // The derivative of y
  //   y' = 2*a*x + b
  // becomes zero at the vertex (xv, yv):
  //   0 = 2*a*xv + b
  // This can be solved for xv:
  const xv = -b / (2*a);

  // yv can be computed from xv:
  //   yv = a*xv^2 + b*xv + c
  // which can be simplified to
  let yv = b * xv / 2

  // Now compensate the initial shift:
  yv += yc;

  return {xv, yv};
}
