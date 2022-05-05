import { FFTFactory } from "fft-api/dst";
import { FC, useEffect, useRef, useState } from "react";
import { animationFrame } from "./animationFrames";
import McLeodPitchDetector from "./McLeodPitchDetector";
import { useVersions } from "./VersionContext";

export const FrequenciesDemo: FC<{}> = () => {
  const versionState = useVersions()["MW fft60"];
  switch (versionState.status) {
    case "pending": return <p>Loading FFT...</p>;
    case "rejected": return <p>Could not load FFT.</p>;
    case "resolved": return <FrequenciesDemo1 fftFactory={versionState.value}/>;
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
  fftWindowSize;

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

const FrequenciesDemo1: FC<{fftFactory: FFTFactory}> = ({fftFactory}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [foo, setPitchResult] = useState({period: 0, clarity: 0});
  useEffect(() => {
    let animationFrameId: number | null = null;
    function setAnimationFrameId(value: number): void { animationFrameId = value; }

    const cc = canvasRef.current?.getContext("2d");
    let ac: AudioContext;
        
    async function loop(cc: CanvasRenderingContext2D) {
      const rgbaData = new Uint8ClampedArray(height * stepWidth * 4);
      const freqData = new Uint8Array(fftWindowSize);
      const timeData = new Float32Array(fftWindowSize);

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
        analyser.getFloatTimeDomainData(timeData);
        const pitchResult = McLeodPitchDetector(pitchWindowSize, timeData);
        const pos = freq2pos(2/pitchResult.period);
        setPitchResult(pitchResult);
        if (pitchResult.clarity > 0.9) {
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
  }, [canvasRef]);

  const noDisplay = foo.period === 0 || foo.clarity < 0.8;
  const frequencyHz = sampleRate / foo.period;
  const midiPitch = Math.log2(frequencyHz / 440) * 12 + 69;
  const midiPitchRounded = Math.round(midiPitch);
  const octave = Math.floor(midiPitchRounded / 12) - 1;
  const note = notes[midiPitchRounded % 12];
  const centsOffset = (100 * (midiPitch - midiPitchRounded));
  const cents =
    Math.abs(centsOffset) < 0.5 ? "±\u20070" :
    centsOffset < 0 ? `-${(-centsOffset).toFixed(0).padStart(2, "\u2007")}` :
    `+${(+centsOffset).toFixed(0).padStart(2, "\u2007")}`;
  return <>
    <canvas ref={canvasRef}
      width={width} height={height}
      style={{border: "1px solid green"}}
    ></canvas>
    <table style={{tableLayout: "fixed"}}>
      <col style={{width: "6em"}}/>
      <col style={{width: "6em"}}/>
      <tbody>
        <tr>
          <td>Clarity:</td>
          <td style={{textAlign: "right"}}>{noDisplay ? "-" : (foo.clarity * 100).toFixed(2)}%</td>
        </tr>
        <tr>
          <td>Frequency:</td>
          <td style={{textAlign: "right"}}>{noDisplay ? "-" : frequencyHz.toFixed(1)}</td>
        </tr>
        <tr>
          <td>Midi Pitch:</td>
          <td style={{textAlign: "right"}}>{noDisplay ? "-" : midiPitch.toFixed(2)}</td>
        </tr>
        <tr>
          <td>Note:</td>
          <td style={{textAlign: "right"}}>
            <span style={{width: "1.5em"}}>{noDisplay ? "-" : note}<sub>{noDisplay ? "-" : octave}</sub></span>
            <span style={{width: "3 em", textAlign: "right"}}>{noDisplay ? "-" : cents} ct</span></td></tr>
      </tbody>
    </table>
  </>;
};

const notes = "c c♯ d d♯ e f f♯ g g♯ a b♭ b".split(" ");
