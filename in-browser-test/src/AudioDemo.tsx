import { FC, useEffect, useMemo, useRef, useState } from "react";
import { FFTFactory } from "fft-api/dst";

import { animationFrame } from "./animationFrames";
import Canvas2D from "./Canvas2D";
import McLeodPitchDetector from "./McLeodPitchDetector";
import { useVersions } from "./VersionContext";
import styled from "styled-components";

export const AudioDemo: FC<{}> = () => {
  const versionState = useVersions()["MW fft60"];
  switch (versionState.status) {
    case "pending": return <p>Loading FFT...</p>;
    case "rejected": return <p>Could not load FFT.</p>;
    case "resolved": return <AudioDemo1 fftFactory={versionState.value}/>;
  }
};

// My Firefox seems to sample at 48 kHz by default, not at 44.1 kHz.
// So we better ask for the sample rate.
const getSampleRate = () => {
  const ac = new AudioContext();
  const {sampleRate} = ac;
  ac.close();
  return sampleRate;
}
const sampleRate = getSampleRate();

// TODO make these dependent on the screen size:
const height = 600, width = 800, stepWidth = 1;

/**
 * number of audio samples to use for FFT.
 * 
 * (Must be acceptable for the analyser node.)
 */
const fftWindowSize = 1 << 11;

/**
 * number of audio samples to use for pitch detection.
 * 
 * (Must be less than `fftWindowSize`, need not be a power of 2 for now.)
 * 
 * - Larger values allow to detect lower frequencies.
 * - Smaller values give you more up-to-date values,
 *   but with our current output there is no point to go significantly below
 *   the time between two video frames (typically 1/60 s).
 */
 const pitchWindowSize =
  // Math.round(1/60 * sampleRate);
  // fftWindowSize;
  0.75 * fftWindowSize; // this leaves us some space for horizontally adjusting
                        // the wave display

// We measure frequencies in units of the sampling rate.
const lowerFreqBound = 2 / pitchWindowSize;
const upperFreqBound = 0.5;             // half the sampling rate

const log2_lowerFreqBound = Math.log2(lowerFreqBound);
const log2_upperFreqBound = Math.log2(upperFreqBound);
const nOctaves = log2_upperFreqBound - log2_lowerFreqBound;

const freq2pos = (freq: number): number => {
  const fraction = (Math.log2(freq) - log2_lowerFreqBound) / nOctaves;
  const pos = Math.round((1 - fraction) * height);
  return Math.max(0, Math.min(height - 1, pos));
}

const pos2freq = (pos: number): number => {
  const fraction = 1 - pos / height;
  return 2**(fraction * nOctaves + log2_lowerFreqBound);
}

const AudioDemo1: FC<{fftFactory: FFTFactory}> = ({fftFactory}) => {
  const [pitchDetector] = useState(() =>
    new McLeodPitchDetector(fftWindowSize, pitchWindowSize, fftFactory),
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pitchResult, setPitchResult] = useState({period: 0, clarity: 0});
  const [freeze, setFreeze] = useState(false);
  useEffect(() => {
    let animationFrameId: number | null = null;
    function setAnimationFrameId(value: number): void { animationFrameId = value; }

    const cc = canvasRef.current?.getContext("2d");
    let ac: AudioContext;
        
    async function loop(cc: CanvasRenderingContext2D) {
      const rgbaData = new Uint8ClampedArray(height * stepWidth * 4);
      const freqData = new Uint8Array(fftWindowSize);

      ac = new AudioContext();
      const stream = await navigator.mediaDevices.getUserMedia({audio: true});
      const source = ac.createMediaStreamSource(stream);
      const analyser = ac.createAnalyser();
      analyser.fftSize = fftWindowSize;
      analyser.smoothingTimeConstant = 0.4;
      source.connect(analyser);

      for (;;) {
        await animationFrame(setAnimationFrameId);
        if (freeze) {
          // It's a bit hacky to poll `freeze` upon each animation frame,
          // but for a demo it's ok.
          continue;
        }
        analyser.getByteFrequencyData(freqData);
        cc.putImageData(cc.getImageData(stepWidth, 0, width - stepWidth, height), 0, 0);
        let k = 0;
        for (let i = 0; i < height; i++) {
          const freqIdx = pos2freq(i) * (fftWindowSize / 2);
          const floor = Math.floor(freqIdx);
          const lambda = freqIdx - floor;
          const level = (1 - lambda) * freqData[floor] + lambda * freqData[floor + 1];
          for (let j = 0; j < stepWidth; j++) {
            rgbaData[k++] = level;
            rgbaData[k++] = 0;
            rgbaData[k++] = 0;
            rgbaData[k++] = 0xff;
          }
          // TODO optimize by iterating directly over the arithmetic sequence of
          // pos values instead of the geometric sequence of frequences?
          for (let freq = 440*2**(-45/12) / sampleRate; freq < upperFreqBound; freq *= 2) {
            const pos = freq2pos(freq);
            for (let j = 0; j < stepWidth; j++) {
              rgbaData[(pos * stepWidth + j) * 4 + 2] = 0xff;
            }
          }
        }
        analyser.getFloatTimeDomainData(pitchDetector.values);
        // Just to be consistent with the wave display:
        // (Outside of a demo there is hardly a reason for changing the offset.)
        pitchDetector.offset = getMaxIndex(pitchDetector.values, pitchWindowSize * .25)
        pitchDetector.run();
        const {period, clarity} = pitchDetector;
        setPitchResult({period, clarity});
        const pos = freq2pos(2/period);
        if (clarity > 0.9) {
          for (let j = 0; j < stepWidth; j++) {
            rgbaData[(pos * stepWidth + j) * 4 + 1] = 0xff;
          }
        }

        const imageData = new ImageData(rgbaData, stepWidth, height);
        cc.putImageData(imageData, width - stepWidth, 0);
      }
    }

    if (cc) {
      loop(cc);
    }
    return () => {
      ac?.close();
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    }
  }, [pitchDetector, canvasRef, freeze]);

  const noDisplay = pitchResult.period === 0 || pitchResult.clarity < 0.8;
  const frequencyHz = sampleRate / pitchResult.period;
  const midiPitch = Math.log2(frequencyHz / 440) * 12 + 69;
  const midiPitchRounded = Math.round(midiPitch);
  const octave = Math.floor(midiPitchRounded / 12) - 1;
  const note = notes[midiPitchRounded % 12];
  const centsOffset = (100 * (midiPitch - midiPitchRounded));
  const cents =
    Math.abs(centsOffset) < 0.5 ? "±\u20070" :
    centsOffset < 0 ? `-${(-centsOffset).toFixed(0).padStart(2, "\u2007")}` :
    `+${(+centsOffset).toFixed(0).padStart(2, "\u2007")}`;

  const [tau, setTau] = useState(0);
  return (
    <div style={{height: "100%", width: "850px", overflow: "auto"}}>
      <h1>Audio Demo</h1>
      <p>
        Say something, sing, whistle or play an instrument
        (and allow this page to use the microphone).
      </p>
      <div>
        Pitch:
        <span style={{display: "inline-block", width: "4.5em", textAlign: "right", marginRight: "2em"}}>
          {noDisplay ? "-" : frequencyHz.toFixed(1)} Hz
        </span>
        Note:
        <span style={{display: "inline-block", width: "2em", textAlign: "right"}}>
          {noDisplay ? "-" : note}<sub>{noDisplay ? "-" : octave}</sub>
        </span>
        <span style={{display: "inline-block", width: "3em", textAlign: "right", marginRight: "2em"}}>
          {noDisplay ? "-" : cents} ct
        </span>
        Clarity:
        <span style={{display: "inline-block", width: "4em", textAlign: "right", marginRight: "2em"}}>
        {noDisplay ? "-" : (pitchResult.clarity * 100).toFixed(2)}%
        </span>
      </div>
      <canvas ref={canvasRef} width={width} height={height} style={{backgroundColor: "#eee"}}/>
      <p>
        In a coordinate system with a horizontal time axis
        (with the current time at the right end)
        and a vertical frequency axis (using a logarithmic scale)
        the following things are displayed:</p>
      <ul>
        <li>
          red: the intensity of the frequency in the audio input
        </li>
        <li>
          green (or yellow when over a red area):
          the pitch as determined by the McLeod method
        </li>
        <li>blue: the c notes at each octave for orientation</li>
      </ul>
      <h2>Visual Explanation of the McLeod Pitch-Detection Method</h2>
      <p>
        The pitch displayed above is computed according to the paper {}
        <a target="_blank" rel="noreferrer"
        href="https://www.cs.otago.ac.nz/tartini/papers/A_Smarter_Way_to_Find_Pitch.pdf">
          <em>A Smarter Way to Find Pitch</em>
        </a> by P. McLeod and G. Wyvill.
        In this section we visualize the computation steps of this method.
      </p>
      <p>Here is the (more or less) raw sound wave from your microphone:</p>
      <WaveCanvas pitchDetector={pitchDetector}/>
      <p>
        <label>
          You can freeze the audio input so that you need not keep singing all the time: {}
          <input type= "checkbox" checked={freeze} onChange={event => setFreeze(event.target.checked)}/>
        </label>
      </p>
      <h3>Autocorrelation</h3>
      <p>
        We can correlate this wave with a delayed version of itself.
        Use the slider to change the delay:
      </p>
      <div>
        <input type="range"
          style={{width: 800}}
          min={0} max={pitchWindowSize}
          value={tau} onChange={event => setTau(Number(event.target.value))}
        />
      </div>
      <TwoWaveCanvas pitchDetector={pitchDetector} tau={tau}/>
      <p>
        The product of the two waves at each point of time in the overlap region
        is shown in green where positive and red where negative.
        The "autocorrelation" is defined as the integral over this product,
        or actually a sum since we are using discrete samples:
      </p>
      <blockquote><F>∑ x<sub>i</sub> x<sub>i+τ</sub></F></blockquote>
      <p>
        where <F>i</F> runs from <F>t</F> to <F>t + W − <N>1</N> − τ</F> in the summation.
        Here <F>t</F> is the index of the first sample in the time window,
        {} <F>W</F> is the window length, and <F>τ</F> is the delay.
      </p>
      <p>
        If the two waves are well-aligned, then (almost) all of the products
        are positive and the autocorrelation value is high.
        Otherwise the autocorrelation value is lower or even negative.
      </p>
      <p>
        We can display the autocorrelation as a function of the delay:
      </p>
      <AutoCorrCanvas pitchDetector={pitchDetector} tau={tau}/>
      <p>
        The autocorrelation value does not only depend on how well the
        original and the delayed wave align.
        Its absolute value also decreases with a growing delay
        because the time overlap between the two waves shrinks.
        (This is the "tapering effect" mentioned in the paper
        for the "type II" autocorrelation function.)
      </p>
      <p>
        The absolute product <F>|ab|</F> of two (real) numbers is always smaller
        than the average of their squares <F>½ <P>a<SQ/> + b<SQ/></P></F>.
        When <F>a</F> and <F>b</F> get close to each other,
        then <F>|ab|</F> gets close to <F>½ <P>a<SQ/> + b<SQ/></P></F> as well.
        As a consequence the autocorrelation value
        {} <F>∑ x<sub>i</sub> x<sub>i+τ</sub></F> {}
        ranges between
        {} <F>-½ ∑ <P>x<sub>i</sub><SQ/> + x<sub>i+τ</sub><SQ/></P></F> {}
        and
        {} <F>+½ ∑ <P>x<sub>i</sub><SQ/> + x<sub>i+τ</sub><SQ/></P></F>,
        which we can consider the best and worst case for the correlation.
        (Again <F>i</F> runs from <F>t</F> to <F>t + W − <N>1</N> − τ</F> in the summations.)
        This is the area highlighted in the graph above.
        Notice that the sum
        {} <F>∑ <P>x<sub>i</sub><SQ/> + x<sub>i+τ</sub><SQ/></P></F> {}
        is called <F>m'<sub>t</sub> <P>τ</P></F> in the McLeod/Wyvill paper.
      </p>
      <h3>Normalization</h3>
      <p>
        We divide the autocorrelation function by
        {} <F>½ ∑ <P>x<sub>i</sub><SQ/> + x<sub>i+τ</sub><SQ/></P></F> {}
        to normalize it to the range [−1, +1]:
      </p>
      <NSDFCanvas pitchDetector={pitchDetector}/>
      <p>
        This function is called the "Normalized Square Difference Function"
        (NSDF) <F>n'<sub>t</sub> <P>τ</P></F> in the McLeod/Wyvill paper.
      </p>
      <h3>Peak Picking</h3>
      <p>
        The NSDF is used to determine the pitch as follows:
      </p>
      <ul>
        <li>
          For each positive range between an upward and a downward zero
          crossing the maximum value is determined.
          Actually such a maximum need not occur at a sampling point.
          Parabolic interpolation is used for a better approximation of the
          peak which we would get with continuous sampling.
          (These peaks are marked by bullets in the graph.)
        </li>
        <li>
          The highest of these peaks is determined (marked by a green bullet)
          and a cut-off at some constant percentage of this peak height is calculated.
          In our demo the cut-off percentage is 93%.
          (The cut-off level is marked by a green line.)
        </li>
        <li>
          The first peak above the cut-off level is chosen
          (marked by a red bullet and a vertical red line in the graph).
          It may be the same as the highest peak or a different one.
        </li>
        <li>
          The <F>τ</F> value for this peak is the "pitch period"
          measured in sampling steps.  This period can be converted
          into a frequency and a musical note in the usual way.
          The height of the chosen peak is returned as the "clarity" of the wave.
          (You can see the current pitch frequency, note, and clarity
          at the beginning of the demo.)
        </li>
      </ul>
      <h2>Remarks</h2>
      <h3>A Note on Terminology</h3>
      <p>
        The auto<em>correlation</em> from the previous section is actually more like
        a <a target="_blank" rel="noreferrer"
        href="https://en.wikipedia.org/wiki/Covariance">covariance</a> {}
        between the wave and its delayed version
        (assuming that the mean value of each wave is 0).
        So I would have called this auto<em>covariance</em>.
        (But "autocorrelation" seems to be the established term in
        the signal processing community,
        which apparently follows the terminology
        from probability theory and statistics only loosely.
        See for example
        {} <a target="_blank" rel="noreferrer" href="https://mathworld.wolfram.com/Autocorrelation.html">here</a>,
        {} <a target="_blank" rel="noreferrer" href="https://en.wikipedia.org/wiki/Autocovariance#Normalization">here</a>, and
        {} <a target="_blank" rel="noreferrer" href="https://en.wikipedia.org/wiki/Autocorrelation#Auto-correlation_of_stochastic_processes">here</a>.)
      </p>
      <p>
        This autocovariance can be normalized to an actual autocorrelation
        as usual in statistics by dividing it
        by the standard deviations of the two waves in the overlap region:
      </p>
      <blockquote>
        <F>
          ρ'<sub>t</sub> <P>τ</P> <DEF/> cov'<sub>t</sub> <P>τ</P> / {}
          <P>σ'<sub>t</sub> <P>τ</P> · σ'<sub>t+τ</sub> <P>τ</P></P>
        </F>
      </blockquote>
      <p>where the covariance and the standard deviations are defined as</p>
      <blockquote>
        <F>cov'<sub>t</sub> <P>τ</P> <DEF/> <P> ∑ x<sub>i</sub> x<sub>i+τ</sub> </P> / <P>W − τ</P></F>
        <br/>
        <F>σ'<sub>t</sub> <P>τ</P> <DEF/> <SQRT> <P> ∑ x<sub>i</sub><SQ/> </P> / <P>W − τ</P> </SQRT></F>
        <br/>
        <F>σ'<sub>t+τ</sub> <P>τ</P> <DEF/> <SQRT> <P> ∑ x<sub>i+τ</sub><SQ/> </P> / <P>W − τ</P> </SQRT></F>
      </blockquote>
      <p>
        The primes behind the symbols <F>ρ</F>, <F>cov</F>, and <F>σ</F> {}
        indicate again that these are "type-II" functions.
        That is, the summation index <F>i</F> runs from <F>t</F> to
        {} <F>t + W − <N>1</N> − τ</F>.
      </p>
      <p>
        In our definitions of <F>cov'</F> and <F>σ'</F> we divide the summations
        by the number of terms, that is, by the overlap size <F>W − τ</F>.
        This is just to comply with standard terminology.
        In practice we need not perform the divisions
        because the divisors cancel each other out in the formula for
        the autocorrelation <F>ρ'</F>:
      </p>
      <blockquote>
        <F>
          ρ'<sub>t</sub> <P>τ</P> = <P> ∑ x<sub>i</sub> x<sub>i+τ</sub> </P> / {}
          <SQRT> <P> ∑ x<sub>i</sub><SQ/> </P> · <P> ∑ x<sub>i+τ</sub><SQ/> </P> </SQRT>
        </F>
      </blockquote>
      <p>
        Notice that the denominator
        {} <F><SQRT> <P> ∑ x<sub>i</sub><SQ/> </P> · <P> ∑ x<sub>i+τ</sub><SQ/> </P> </SQRT></F> {}
        is actually the <em>geometric</em> mean of
        {} <F>∑ x<sub>i</sub><SQ/></F> and
        {} <F>∑ x<sub>i+τ</sub><SQ/></F>.
        In the previous section we have used the <em>arithmetic</em> mean
        of these two sums as the denominator for normalization.
        In practice this does not make much of a difference.
        So McLeod's "Normalized Square Difference Function" is actually
        quite close to what I would call an autocorrelation function.
      </p>
      <h3>The Squared Difference Function</h3>
      <p>
        While the approach described above attempts
        to maximize the correlation between the original and the delayed wave,
        we can also try to minimize the differences between the two waves.
        As usual we square the differences so that differences in both directions
        contribute to the "badness" measure.
      </p>
      <p>
        <label>
          Here you have another chance to freeze/unfreeze the audio input: {}
          <input type= "checkbox" checked={freeze} onChange={event => setFreeze(event.target.checked)}/>
        </label>
      </p>
      <p>
        And you can again select the delay <F>τ</F>
      </p>
      <div>
        <input type="range"
          style={{width: 800}}
          min={0} max={pitchWindowSize}
          value={tau} onChange={event => setTau(Number(event.target.value))}
        />
      </div>
      <p>
        to compare the original wave to delayed versions:
      </p>
      <TwoWaveCanvas2 pitchDetector={pitchDetector} tau={tau}/>
      <p>
        The red areas show the squared differences between the two waves.
        If the two waves are well-aligned, these red areas become almost zero.
      </p>
      <p>
        As above, we can consider the integral (actually sum) over the squared
        differences as a function of <F>τ</F>:
      </p>
      <SDFCanvas pitchDetector={pitchDetector} tau={tau}/>
      <p>
        The "Squared Difference Function" (SDF) <F>d'<sub>t</sub> <P>τ</P></F> {}
        can be written as
      </p>
      <blockquote>
        <F>
          d'<sub>t</sub> <P>τ</P>
          {} = {}
          ∑ <P>x<sub>i</sub> − x<sub>i+τ</sub></P><SQ/>
          {} = {}
          ∑ <P>x<sub>i</sub><SQ/> − 2 x<sub>i</sub> x<sub>i+τ</sub> + x<sub>i+τ</sub><SQ/></P>
          {} = {}
          ∑ x<sub>i</sub><SQ/> − 2 ∑ x<sub>i</sub> x<sub>i+τ</sub> + ∑ x<sub>i+τ</sub><SQ/>
        </F>
      </blockquote>
      <p>
        Using our earlier result that {}
        <F>∑ x<sub>i</sub> x<sub>i+τ</sub> &gt;
        −½ ∑ <P>x<sub>i</sub><SQ/> + x<sub>i+τ</sub><SQ/></P></F> {}
        we can conclude that
      </p>
      <blockquote>
        <F>
          d'<sub>t</sub> <P>τ</P>
          {} &lt; {}
          ∑ x<sub>i</sub><SQ/> + 2 · ½ ∑ <P>x<sub>i</sub><SQ/> + x<sub>i+τ</sub><SQ/></P> + ∑ x<sub>i+τ</sub><SQ/>
          {} = {}
          2 · <P> ∑ x<sub>i</sub><SQ/> + ∑ x<sub>i+τ</sub><SQ/> </P>
          {} = {}
          2 m'<sub>t</sub> <P>τ</P>
        </F>
      </blockquote>
      <p>
        The area below <F>2 m'<sub>t</sub> <P>τ</P></F> is highlighted in
        the graph above.
        So we can normalize the SDF to the range [0, 1] by dividing it
        by <F>2 m'<sub>t</sub> <P>τ</P></F>:
      </p>
      <blockquote>
        <F>
          d'<sub>t</sub> <P>τ</P> / <P>2 m'<sub>t</sub> <P>τ</P></P>
        </F>
      </blockquote>
      <p>
        This is what I would have called the "normalized squared-difference function":
      </p>
      <NSDF2Canvas pitchDetector={pitchDetector}/>
      <p>
        Collecting the minima and picking one of them as the pitch period
        can be done in a way completely analogous to the peak picking algorithm
        for the autocorrelation function above and it leads to the same pitch.
      </p>
      <p>
        The close relationship between this function and the autocorrelation function
        {} <F>n'<sub>t</sub> <P>τ</P></F> {}
        is probably the reason why McLeod and Wyvill call the latter the
        "Normalized Squared-Difference Function".
      </p>
      <h3>A Note on Tapering</h3>
      <p>
        When the delay <F>τ</F> gets close to the window size <F>W</F> the
        overlap <F>W − τ</F> of the two waves gets short.
        This lets the normalized values
        (<F>n'<sub>t</sub> <P>τ</P></F>,
        {} <F>ρ<sub>t</sub> <P>τ</P></F>, and
        {} <F>d'<sub>t</sub> <P>τ</P></F>)
        become statistically unstable.
        We easily get the highest peak for <F>τ</F> close to <F>W</F> and
        with a noisy signal that peak is also selected for the pitch period.
      </p>
      <p>
        To overcome this problem, high values of <F>τ</F> {}
        (for example <F>τ &gt; ½ W</F>)
        should be ignored when searching for the highest peak.
        In their conclusion McLeod and Wyvill state that
        the algorithm can "extract pitch with as little as two periods".
        That is, it is anyway assumed that the pitch period is shorter than
        {} <F>½ W</F>.
      </p>
      <h3>A Note on Superimposition</h3>
      <p>
        A funny effect can be observed
        when the input signal is the superimposition of of two tones
        whose base frequencies have ratios close to 2/3, 3/4, 2/5, 3/5, 4/5,
        or the like
        ( in general, fractions whose numerator and denominator in reduced form
        are small numbers but greater than 1).
        With appropriate amplitudes the determined pitch period will be the
        least common multiple of the individual pitch periods.
        Or, equivalently, the determined pitch frequency will be the
        greatest common divisor of the individual pitch frequencies.
      </p>
      <p>
        Peaks in the (normalized) autocorrelation graph occur at
        the pitch period of an individual tone and multiples thereof.
        But the highest peaks appear for the common multiples
        of the two pitch periods.
      </p>
      <p>
        You can try this by playing two notes simultaneously
        that are a fifth, a fourth, or even just a major or minor third apart.
      </p>
      <h2>And Finally: FFT</h2>
      <p>
        While the frequency display at the top of the demo is based on
        the built-in FFT of your browser's WebAudio system,
        a separate FFT implementation is used for computing the
        autocorrelation function efficiently.
      </p>
      <p>
        A straight-forward implementation of
        {} <F>∑ x<sub>i</sub> x<sub>i+τ</sub></F> {}
        for <F>τ = 0, 1, ..., W − 1</F> (with window size <F>W</F>)
        where in each summation <F>i</F> ranges from <F>t</F> to
        {} <F>t + W − <N>1</N> − τ</F> {}
        uses two nested loops, which has complexity
        {} <F>O<P>W<sup><N>2</N></sup></P></F>.
        But notice that the autocorrelation/autocovariance function
        happens to be a convolution
        of the wave function (with some zero-padding) with itself.
        This made it possible to speed things up to complexity
        {} <F>O<P>W <N>log</N><P>W</P></P></F> by using
        an <a target="_blank" href="">FFT-based computation</a>.
      </p>
    </div>
  );
};

const notes = "c c♯ d d♯ e f f♯ g g♯ a b♭ b".split(" ");

const F = styled.span`
  font-family: serif;
  font-style: italic;
  white-space: nowrap;
`;

const N = styled.span`
  font-style: normal;
`;

const DEF: FC = () => <N>≔</N>

const P: FC = ({children}) => <><N>(</N>{children}<N>)</N></>;

const SQ: FC = () => <sup><N>2</N></sup>

const SQRT: FC = ({children}) => (
  <>&radic;<span style={{borderTop: "1px solid black"}}>{children}</span></>
);


/** TypeScript should provide this out of the box */
type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array;

function getMaxIndex<T extends TypedArray>(array: T, limit = array.length) {
  let max = 0, max_i = 0;
  for (let i = 0; i < limit; i++) {
    if (array[i] > max) {
      max = array[i];
      max_i = i;
    }
  }
  return max_i;
}

function stdDev<T extends TypedArray>(array: T, limit = array.length) {
  let sum = 0;
  for (let i = 0; i < limit; i++) {
    const val = array[i];
    sum += val * val;
  }
  return Math.sqrt(sum / limit);
}

// TODO Use a chart library? 
// See https://www.google.com/search?q=react+chart+library

/**
 * Draw a function as Path2D.
 * 
 * We could do the translation on the canvas context, but scaling on the
 * canvas context has undesired effects on the stroke width.  So we just do
 * both transformations (translation + scaling) here.
 */
function drawFunc(
  func: (x: number) => number,
  {
    from = 0, to = 1, step = 1,
    scaleX = 1, scaleY = 1,
    shiftX = 0, shiftY = 0,
    close = false,
  },
): Path2D {
  const path = new Path2D()
  path.moveTo(shiftX + scaleX * from, shiftY + scaleY * func(from));
  for (let x = from + step; x < to; x += step) {
    path.lineTo(shiftX + scaleX * x, shiftY + scaleY * func(x));
  }
  if (close) {
    path.lineTo(shiftX + scaleX * to, shiftY);
    path.lineTo(shiftX              , shiftY);
    path.closePath();
  }
  return path;
}

function line(
  {
    x1 = 0, x2 = 0,
    y1 = 0, y2 = 0,
    scaleX = 1, scaleY = 1,
    shiftX = 0, shiftY = 0,
  },
): Path2D {
  const path = new Path2D()
  path.moveTo(shiftX + scaleX * x1, shiftY + scaleY * y1);
  path.lineTo(shiftX + scaleX * x2, shiftY + scaleY * y2);
  return path;
}

function zeroLine(
  {
    from = 0, to = 1,
    scaleX = 1,
    shiftX = 0, shiftY = 0,
  },
): Path2D {
  return line({x1: from, x2: to, scaleX, shiftX, shiftY});
}

const TAU = 2 * Math.PI;

function dot(
  cx: number, cy: number, r: number,
  {
    scaleX = 1, scaleY = 0,
    shiftX = 0, shiftY = 0,
  },
): Path2D {
  const path = new Path2D();
  path.arc(shiftX + scaleX * cx, shiftY + scaleY * cy, r, 0, TAU);
  return path;
}

const canvasProps = {
  width: 800, height: 200,
  style: {border: "1px solid black"},
};

const WaveCanvas: FC<{pitchDetector: McLeodPitchDetector}> = ({
  pitchDetector
}) => <Canvas2D {...canvasProps} animate={useMemo(() => (t, cc) => {
  const {width, height} = cc.canvas;
  cc.clearRect(0, 0, width, height);
  const {values, dataSize, n} = pitchDetector;
  // Select the display window in such a way that it begins at some peak.
  // This is just a heuristic approach to make the wave display more stable
  // with live data.
  const offset = getMaxIndex(values, n * 0.25);
  const options = {
    to: dataSize,
    scaleX: width / n,
    scaleY: -30 / Math.max(0.01, stdDev(values)),
    shiftY: height / 2,
  };
  cc.stroke(zeroLine(options));
  cc.strokeStyle = "blue";
  cc.stroke(drawFunc(x => values[x + offset], options));
}, [pitchDetector])}/>

const TwoWaveCanvas: FC<{pitchDetector: McLeodPitchDetector, tau: number}> = ({
  pitchDetector, tau
}) => <Canvas2D {...canvasProps} animate={useMemo(() => (t, cc) => {
  const {width, height} = cc.canvas;
  cc.clearRect(0, 0, width, height);
  const {values, dataSize, n} = pitchDetector;
  // Here we have to select the same time window for the unshifted wave
  // as in the WaveCanvas.
  // TODO refactor to helper function
  const offset = getMaxIndex(values, n * 0.25);
  const rescale = Math.max(0.01, stdDev(values));
  const options = {
    to: dataSize,
    scaleX: width / n,
    scaleY: -30 / rescale,
    shiftY: height / 2,
  };
  const optionsClose = {...options, close: true};
  cc.stroke(zeroLine(options));
  cc.strokeStyle = "blue";
  const wave1 = (x: number) => values[x + offset];
  const wave2 = (x: number) => {
    const xPrime = x - tau;
    return xPrime <= 0 ? 0 : values[xPrime + offset];
  };
  cc.fillStyle = "#0f04";
  cc.fill(drawFunc(x => Math.max(0, wave1(x) * wave2(x)) / (rescale * 2), optionsClose));
  cc.fillStyle = "#f004";
  cc.fill(drawFunc(x => Math.min(0, wave1(x) * wave2(x)) / (rescale * 2), optionsClose));
  cc.stroke(drawFunc(wave1, options));
  cc.strokeStyle = "#00f8";
  cc.stroke(drawFunc(wave2, options));
}, [pitchDetector, tau])}/>

const AutoCorrCanvas: FC<{pitchDetector: McLeodPitchDetector, tau: number}> = ({
  pitchDetector, tau
}) => <Canvas2D {...canvasProps} animate={useMemo(() => (t, cc) => {
  const {width, height} = cc.canvas;
  cc.clearRect(0, 0, width, height);
  const {rs, m1s, m2s, n} = pitchDetector;
  const m = (tau: number) => (m1s[tau] + m2s[tau]) / 2;
  // // I'd actually prefer the geometric mean, which makes r/m the correlation:
  // const m = (tau: number) => Math.sqrt(m1s[tau] * m2s[tau]);
  const options =  {
    to: n,
    scaleX: width / n,
    scaleY: -height/2 / m(0),
    shiftY: height/2,
  };
  const optionsClose = {...options, close: true};
  cc.fillStyle = "#00f2";
  cc.fill(drawFunc(tau => +m(tau), optionsClose));
  cc.fill(drawFunc(tau => -m(tau), optionsClose));
  cc.stroke(zeroLine(options));
  const tauMarkColor = rs[tau] > 0 ? "green" : "red";
  cc.fillStyle = tauMarkColor;
  cc.strokeStyle = tauMarkColor;
  cc.stroke(line({x1: tau, y1: 0, x2: tau, y2: rs[tau], ...options}));
  cc.fill(dot(tau, rs[tau], 4, options));
  cc.strokeStyle = "blue";
  cc.stroke(drawFunc(tau => rs[tau], options));
}, [pitchDetector, tau])}/>

const NSDFCanvas: FC<{pitchDetector: McLeodPitchDetector}> = ({
  pitchDetector
}) => <Canvas2D {...canvasProps} animate={useMemo(() => (t, cc) => {
  const {width, height} = cc.canvas;
  cc.clearRect(0, 0, width, height);
  const {nsdf, n, peaks, highestPeak, k, period, clarity} = pitchDetector;
  const options = {
    to: n,
    scaleX: width / n,
    scaleY: -height / 2 / nsdf[0],
    shiftY: height / 2,
  }
  cc.stroke(zeroLine(options));
  cc.strokeStyle = "blue";
  cc.stroke(drawFunc(tau => nsdf[tau], options));

  for (const {tau, val} of peaks) {
    const r = val === highestPeak ? 6 : 3;
    cc.fillStyle = val === highestPeak ? "green" : "blue";
    cc.fill(dot(tau, val, r, options));
  }

  cc.strokeStyle = "green";
  const limit = k * highestPeak;
  cc.stroke(line({x1: 0, x2: n, y1: limit, y2: limit, ...options}));

  cc.strokeStyle = "red";
  cc.stroke(line({x1: period, x2: period, y1: 0, y2: clarity, ...options}));
  cc.fillStyle = "red";
  cc.fill(dot(period, clarity, 3, options));
}, [pitchDetector])}/>


const TwoWaveCanvas2: FC<{pitchDetector: McLeodPitchDetector, tau: number}> = ({
  pitchDetector, tau
}) => <Canvas2D {...canvasProps} animate={useMemo(() => (t, cc) => {
  const {width, height} = cc.canvas;
  cc.clearRect(0, 0, width, height);
  const {values, dataSize, n} = pitchDetector;
  const offset = getMaxIndex(values, n * 0.25);
  const rescale = Math.max(0.01, stdDev(values));
  const options = {
    to: dataSize,
    scaleX: width / n,
    scaleY: -30 / rescale,
    shiftY: height / 2,
  };
  const optionsClose = {...options, close: true};
  cc.stroke(zeroLine(options));
  cc.strokeStyle = "blue";
  const wave1 = (x: number) => values[x + offset];
  const wave2 = (x: number) => {
    const xPrime = x - tau;
    return xPrime <= 0 ? values[x + offset] : values[xPrime + offset];
  };
  cc.fillStyle = "#f004";
  cc.fill(drawFunc(x => (wave1(x) - wave2(x))**2 / (rescale * 10), optionsClose));
  cc.stroke(drawFunc(wave1, options));
  cc.strokeStyle = "#00f8";
  cc.stroke(drawFunc(wave2, options));
}, [pitchDetector, tau])}/>

const SDFCanvas: FC<{pitchDetector: McLeodPitchDetector, tau: number}> = ({
  pitchDetector, tau
}) => <Canvas2D {...canvasProps} animate={useMemo(() => (t, cc) => {
  const {width, height} = cc.canvas;
  cc.clearRect(0, 0, width, height);
  const {rs, m1s, m2s, n} = pitchDetector;
  const m   = (tau: number) => m1s[tau] + m2s[tau]
  const sdf = (tau: number) => m(tau) / 2 - rs[tau];
  const options =  {
    to: n,
    scaleX: width / n,
    scaleY: -height / m(0),
    shiftY: height,
  };
  cc.fillStyle = "#00f2";
  cc.fill(drawFunc(m, {...options, close: true}));
  cc.stroke(zeroLine(options));
  cc.strokeStyle = "blue";
  cc.stroke(drawFunc(sdf, options));
  cc.fillStyle = "red";
  const value = sdf(tau);
  cc.fill(dot(tau, value, 4, options));
  cc.strokeStyle = "red";
  cc.stroke(line({x1: tau, x2: tau, y1: 0, y2: value, ...options}));
}, [pitchDetector, tau])}/>

const NSDF2Canvas: FC<{pitchDetector: McLeodPitchDetector}> = ({
  pitchDetector
}) => <Canvas2D {...canvasProps} animate={useMemo(() => (t, cc) => {
  const {width, height} = cc.canvas;
  cc.clearRect(0, 0, width, height);
  const {/* rs, m1s, m2s, */ nsdf, n} = pitchDetector;
  // const m   = (tau: number) => (m1s[tau] + m2s[tau])/2;
  // const sdf = (tau: number) => m(tau) - rs[tau];
  // const nsdf2 = (tau: number) => sdf(tau) / 2 / m(tau);
  // const nsdf3 = (tau: number) => (1 - rs[tau] / m(tau)) / 2;
  const nsdf4 = (tau: number) => (1 - nsdf[tau]) / 2;
  const options = {
    to: n,
    scaleX: width / n,
    scaleY: -height / nsdf[0],
    shiftY: height,
  }
  cc.strokeStyle = "blue";
  cc.stroke(drawFunc(nsdf4, options));
}, [pitchDetector])}/>
