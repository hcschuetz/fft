import { abs2, zero } from "complex/dst/Complex";
import { FFT, FFTFactory } from "fft-api/dst";
import parabolaVertex from "./parabolaVertex";

const shouldSelfTest = false;

/**
 * See https://www.cs.otago.ac.nz/tartini/papers/A_Smarter_Way_to_Find_Pitch.pdf
 * 
 * This function returns the period measured in samples (aka frames).
 * It is left to the caller to convert this into a pitch frequency.
 */
export default
class McLeodPitchDetector {
  public readonly k = 0.93; // may be changed by client code

  public readonly values: Float32Array;
  public readonly rs: Float64Array; // only needed for demo purposes
  public readonly m1s: Float64Array; // only needed for demo purposes
  public readonly m2s: Float64Array; // only needed for demo purposes
  public readonly nsdf: Float64Array;
  public readonly fft: FFT;
  public offset: number; // can be changed for demo purposes

  public period: number = -1;
  public clarity: number = -1;
  public highestPeak: number = -1;
  public peaks: { tau: number; val: number; }[] = [];

  constructor(
    public readonly dataSize: number,
    public readonly n: number,
    public readonly fftFactory: FFTFactory,
  ) {
    this.values = new Float32Array(dataSize);
    this.rs = new Float64Array(n);
    this.m1s = new Float64Array(n);
    this.m2s = new Float64Array(n);
    this.nsdf = new Float64Array(n);
    // Actually a smaller FFT would suffice if we restricted our search for
    // peaks to the first half (or so) of the window, which would make sense
    // to avoid the unstable behavior due to tapering.
    this.fft = fftFactory(1 << (Math.ceil(Math.log2(2*n))));
    // If there are more than n values, take the latest ones,
    // that is, toward the end of the array.
    this.offset = dataSize - n;
  }
  
  run() {
    const {dataSize, n, values, k, rs, m1s, m2s, nsdf, fft, offset} = this;

    // Optimized implementation with complexity O(n*log(n)):
    // This could be optimized even more with a specific FFT implementation
    // for real input and output.
    let sum_x_square = 0;
    for (let k = 0; k < n; k++) {
      const x = values[offset + k];
      sum_x_square += x*x;
      m1s[n-1-k] = sum_x_square;
    }

    for (let i = 0; i < fft.size; i++) {
      fft.setInput(i, i < n ? {re: values[i+offset], im: 0} : zero);
    }
    fft.run();
    for (let i = 0; i < fft.size; i++) {
      fft.setInput(i, {re: abs2(fft.getOutput(i)), im: 0});
    }
    fft.run(-1);

    for (let tau = 0; tau < n; tau++) {
      const m1 = m1s[tau];
      const m2 = m2s[tau] = sum_x_square - (tau === 0 ? 0 : m1s[n-tau]);
      const r = rs[tau] = fft.getOutput(tau).re / fft.size;
      nsdf[tau] =  2 * r / (m1 + m2);
    }

    if (shouldSelfTest) {
      // Compare results from the optimized computation above
      // with results from an unoptimized computation.
      // The unoptimized computation has complexity O(n**2):
      const diffs: any[] = [];
      function assertClose(text: string, x: number, y: number, limit: number) {
        if (Math.abs(x - y) > limit) {
          diffs.push([text, x, y, x - y, limit]);
        }
      }
      for (let tau = 0; tau < n; tau++) {
        let m1 = 0, m2 = 0, r = 0;
        for (let i = offset, j = offset + tau; j < dataSize; i++, j++) {
          const vi = values[i], vj = values[j];
          m1 += vi * vi
          m2 += vj * vj; 
          r += vi * vj;
        }
        assertClose(`m1s[${tau}]`, m1s[tau], m1, 0);
        assertClose(`m2s[${tau}]`, m2s[tau], m2, 1e-12);
        assertClose(`rs[${tau}]`, rs[tau], r, 1e-12);
        // For tau close to n the denominator (m1 + m2) becomes small
        // and nsdf[tau] becomes a bit numerically unstable.
        // So we use a more relaxed similarity limit.
        // For smaller values of tau we could use a stricter limit.
        assertClose(`nsdf[${tau}]`, nsdf[tau], 2 * r / (m1 + m2), 1e-10);
      }
      if (diffs.length > 0) {
        console.error("unexpected differences between optimized and unoptimized computation", diffs);
      }
    }

    // pick the appropriate peak in nsdf:
    let peaks: {tau: number, val: number}[] = [];
    let tau = 0;
    // skip the initial positive range:
    while (tau < n && nsdf[tau] > 0) tau++;
    while (tau < n) {
      // a non-positive range begins; skip it:
      // (notice the use of `!(... > 0)` instead of `(... <= 0)`,
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
