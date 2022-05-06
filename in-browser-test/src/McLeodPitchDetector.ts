import parabolaVertex from "./parabolaVertex";

/**
 * See https://www.cs.otago.ac.nz/tartini/papers/A_Smarter_Way_to_Find_Pitch.pdf
 * 
 * This function returns the period measured in samples (aka frames).
 * It is left to the caller to convert this into a pitch frequency.
 */
export default
class McLeodPitchDetector {
  public k = 0.93; // may be changed by client code

  public values: Float32Array;
  public readonly rs: Float64Array; // only needed for demo purposes
  public readonly ms: Float64Array; // only needed for demo purposes
  public readonly nsdf: Float64Array;

  public period: number = -1;
  public clarity: number = -1;
  public highestPeak: number = -1;
  public peaks: { tau: number; val: number; }[] = [];

  constructor(
    public readonly dataSize: number,
    public readonly n: number,
  ) {
    this.values = new Float32Array(dataSize);
    this.rs = new Float64Array(n);
    this.ms = new Float64Array(n);
    this.nsdf = new Float64Array(n);
  }
  
  run() {
    const {n, values, k, rs, ms, nsdf} = this;
    // if there are more than n values, take the latest ones,
    // that is, toward the end of the array
    const offset = values.length - n;

    // TODO use FFT-based optimization
    for (let tau = 0; tau < n; tau++) {
      let r = 0;
      let m = 0;
      for (let i = offset, j = offset + tau; j < values.length; i++, j++) {
        const vi = values[i], vj = values[j];
        r += vi * vj;
        m += vi * vi + vj * vj; 
      }
      rs[tau] = r;
      ms[tau] = m;
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
    const threshold = highestPeak * k;
    const pickedPeak = peaks.find(p => p.val > threshold) ?? {tau: 0, val: 0};
    this.period = pickedPeak.tau
    this.clarity = pickedPeak.val;
    
    // for demo purposes:
    this.peaks = peaks;
    this.highestPeak = highestPeak;
  }
}
