import parabolaVertex from "./parabolaVertex";

/**
 * See https://www.researchgate.net/publication/230554927_A_smarter_way_to_find_pitch
 * 
 * This function returns the period measured in samples (aka frames).
 * It is left to the caller to convert this into a pitch frequency.
 */
export default
function McLeodPitchDetector(n: number, values: Float32Array): {period: number, clarity: number} {
  // if there are more than n values, take the latest ones,
  // that is, toward the end of the array
  const offset = values.length - n;

  // TODO use FFT-based optimization
  const nsdf = new Float64Array(n);
  for (let tau = 0; tau < n; tau++) {
    let r = 0;
    let m = 0;
    for (let i = offset, j = offset + tau; j < values.length; i++, j++) {
      const vi = values[i], vj = values[j];
      r += vi * vj;
      m += vi * vi + vj * vj; 
    }
    nsdf[tau] = 2 * r / m;
  }

  // pick the appropriate peak in nsdf:
  let peaks: {tau: number, val: number}[] = [];
  let tau = 0;
  // skip the initial positive range:
  while (tau < n && nsdf[tau] > 0) tau++;
  while (tau < n) {
    // a non-positive range begins; skip it:
    // (notice the use of `!(... > 0)` instead of `(... = 0)`,
    // avoiding infinite loops upon NaN;)
    while (tau < n && !(nsdf[tau] > 0)) tau++;
    // a positive range begins; determine the maximum value and position
    let max = 0;
    let tauMax = tau;
    while (tau < n && nsdf[tau] > 0) {
      if (nsdf[tau] > max) {
        max = nsdf[tau];
        tauMax = tau;
      }
      tau++;
    }
    // a positive range has ended;
    // get its refined maximum and position using parabolic interpolation:
    const {xv, yv} =
      parabolaVertex(nsdf[tauMax-1], max, nsdf[Math.min(tauMax+1, n-1)]);
    peaks.push({tau: tauMax + xv, val: yv});
  }
  const highestPeak = Math.max(...peaks.map(p => p.val));
  const threshold = highestPeak * 0.93; // TODO make k configurable
  const pickedPeak = peaks.find(p => p.val > threshold) ?? {tau: 0, val: 0};
  return {period: pickedPeak.tau, clarity: pickedPeak.val};
}
