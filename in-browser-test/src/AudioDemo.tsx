import { FFTFactory } from "fft-api/dst";
import { FC, useEffect, useRef, useState } from "react";
import { animationFrame } from "./animationFrames";
import Canvas2D from "./Canvas2D";
import McLeodPitchDetector from "./McLeodPitchDetector";
import { useVersions } from "./VersionContext";

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
    new McLeodPitchDetector(fftWindowSize, pitchWindowSize),
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pitchResult, setPitchResult] = useState({period: 0, clarity: 0});
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
  }, [pitchDetector, canvasRef]);

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
  return (
    <div style={{height: "100%", width: "850px", overflow: "auto"}}>
      <h1>Audio Demo</h1>
      <p>
        Say something, sing, whistle or play an instrument
        (and allow this page to use the microphone).
      </p>
      <div>
        Pitch:
        <span style={{display: "inline-block", width: "3em", textAlign: "right", marginRight: "2em"}}>
          {noDisplay ? "-" : frequencyHz.toFixed(1)}
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
      <canvas ref={canvasRef} width={width} height={height}></canvas>
      <p>Legend:</p>
      <ul>
        <li>
          red: the intensity of the frequency
          (determined by the built-in FFT of your browser's WebAudio system)
        </li>
        <li>blue: the c notes at each octave</li>
        <li>
          green (or yellow when over a red area):
          the pitch as determined by the McLeod method
        </li>
      </ul>
      <p>The vertical (frequency) axis uses a logarithmic scale.</p>

      <h2>How The McLeod Pitch-Detection Method Works</h2>
      <p>Here is the (more or less) raw sound wave from your microphone:</p>
      <WaveCanvas pitchDetector={pitchDetector}/>
      <p>
        We can correlate this wave with a delayed version of itself.
        This "autocorrelation" is a function of the delay:
      </p>
      <AutoCorrCanvas pitchDetector={pitchDetector}/>
      <p>
        SDF:
      </p>
      <SDFCanvas pitchDetector={pitchDetector}/>
      <p>
        ...normalize:
      </p>
      <NSDFCanvas pitchDetector={pitchDetector}/>
    </div>
  );
};

const notes = "c c♯ d d♯ e f f♯ g g♯ a b♭ b".split(" ");

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
  },
): Path2D {
  const path = new Path2D()
  path.moveTo(shiftX + scaleX * from, shiftY + scaleY * func(from));
  for (let x = from + step; x < to; x += step) {
    path.lineTo(shiftX + scaleX * x, shiftY + scaleY * func(x));
  }
  return path;
}

function zeroLine(
  {
    from = 0, to = 1,
    scaleX = 1,
    shiftX = 0, shiftY = 0,
  },
): Path2D {
  const path = new Path2D()
  path.moveTo(shiftX + scaleX * from, shiftY);
  path.lineTo(shiftX + scaleX * to  , shiftY);
  return path;
}

const WaveCanvas: FC<{pitchDetector: McLeodPitchDetector}> = ({
  pitchDetector
}) => <Canvas2D width={800} height={200} animate={(t, cc) => {
  const {width, height} = cc.canvas;
  cc.clearRect(0, 0, width, height);
  const {values, dataSize, n} = pitchDetector;
  const maxIdx = getMaxIndex(values, n * 0.25);
  const limit = 0.98 * values[maxIdx];
  let offset = 0;
  while (offset <= maxIdx && values[offset] < limit) offset++;
  const options = {
    to: dataSize,
    scaleX: width / n,
    scaleY: -32 / Math.max(0.01, stdDev(values)),
    shiftY: height / 2,
  };
  console.log(offset, options)
  cc.stroke(zeroLine(options));
  cc.stroke(drawFunc(x => values[x + offset], options));
}}/>

const AutoCorrCanvas: FC<{pitchDetector: McLeodPitchDetector}> = ({
  pitchDetector
}) => <Canvas2D width={800} height={200} animate={(t, cc) => {
  const {width, height} = cc.canvas;
  cc.clearRect(0, 0, width, height);
  const {rs, ms, n} = pitchDetector;
  const options =  {
    to: n,
    scaleX: width / n,
    scaleY: -height / 2 / ms[0],
    shiftY: height/2,
  };
  cc.stroke(zeroLine(options));
  cc.stroke(drawFunc(tau => 2 * rs[tau], options));
  cc.stroke(drawFunc(tau => ms[tau], options));
  cc.stroke(drawFunc(tau => -ms[tau], options));
}}/>

const SDFCanvas: FC<{pitchDetector: McLeodPitchDetector}> = ({
  pitchDetector
}) => <Canvas2D width={800} height={200} animate={(t, cc) => {
  const {width, height} = cc.canvas;
  cc.clearRect(0, 0, width, height);
  const {rs, ms, n} = pitchDetector;
  const options =  {
    to: n,
    scaleX: width / n,
    scaleY: -height / 2 / ms[0],
    shiftY: height,
  };
  cc.stroke(zeroLine(options));
  cc.stroke(drawFunc(tau => ms[tau] - 2 * rs[tau], options));
  cc.stroke(drawFunc(tau => 2 * ms[tau], options));
}}/>

const NSDFCanvas: FC<{pitchDetector: McLeodPitchDetector}> = ({
  pitchDetector
}) => <Canvas2D width={800} height={200} animate={(t, cc) => {
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
  cc.stroke(drawFunc(tau => nsdf[tau], options));

  for (const {tau, val} of peaks) {
    const markSize = val === highestPeak ? 6 : 4
    cc.strokeRect(
                       tau * options.scaleX - markSize/2,
      options.shiftY + val * options.scaleY - markSize/2,
      markSize,
      markSize);
  }

  cc.strokeRect(0, options.shiftY                           , width, 0);
  cc.strokeRect(0, options.shiftY - k * highestPeak * options.scaleY, width, 0);

  cc.strokeRect(period * options.scaleX, options.shiftY, 0, clarity * options.scaleY)

}}/>
