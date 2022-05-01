import { abs2, Complex, expi, times, timesScalar, zero } from "complex/dst/Complex";
import { FFT, FFTFactory } from "fft-api/dst";
import { createContext, FC, useContext, useEffect, useRef, useState } from "react";
import { useAnimationFrames } from "./animationFrames";
import filledArray from "./filledArray";
import ParameterTable from "./ParameterTable";
import useSlider from "./useSlider";
import { useVersions } from "./VersionContext";

type Coeff = {k: number, c: Complex, abs: number};

const TAU = 2 * Math.PI;

export const Clockwork: FC<{}> = () => {
  const versionState = useVersions()["MW\u00a0fft60"];
  switch (versionState.status) {
    case "pending": return <p>Loading FFT...</p>;
    case "rejected": return <p>Could not load FFT.</p>;
    case "resolved": return <Clockwork1 fftFactory={versionState.value}/>;
  }
};

const RoundsContext = createContext(0);

const RoundsProvider: FC<{speed: number}> = ({speed, children}) => {
  const t = useAnimationFrames() / 1000;
  const tRef = useRef(t);
  const roundsRef = useRef(0);
  let rounds = roundsRef.current + (t - tRef.current) * speed;
  rounds -= Math.floor(rounds);
  roundsRef.current = rounds;
  tRef.current = t;
  return (
    <RoundsContext.Provider value={rounds}>
      {children}
    </RoundsContext.Provider>
  )
}

const useRounds = () => useContext(RoundsContext);

const machineryDisplays = ["nothing", "hands", "hands and dials"];

/*
What else we might make configurable:
- FFT version?
- path of the image (string input?)
- size (number of points to be taken in the path) (slider)
- position (disabled if speed !== 0)
  (but naively passing through the position might re-render unchanged stuff!
  using a context should help.)
- whether we sort clock hands by hand length (as we currently do) or by
  rotation speed
*/

type Config = {
  nHands: number,
  showOrig: boolean,
  machineryDisplay: number,
  showTrace: boolean,
};
const ConfigContext = createContext<Config | undefined>(undefined);
const useConfig = (): Config => useContext(ConfigContext)!;

// I had this configurable, but it turns out that configuring nHands is enough.
const size = 1 << 9;

const Clockwork1: FC<{fftFactory: FFTFactory}> = ({fftFactory}) => {
  const [nHandsLabel, nHandsSlider, nHands] = useSlider({
    id: "nHandsCW", label: "Number of \"clock hands\":",
    min: 0, max: size - 1,
    init: 100, transform: x => x,
  });
  const [showOrig, setShowOrig] = useState(false);
  // TODO: provide space for the output of the following slider
  const [machineryDisplayLabel, machineryDisplaySlider, machineryDisplay] = useSlider({
    id: "machineryDisplayCW", label: "Display machinery:",
    min: 0, max: machineryDisplays.length - 1,
    init: 2, transform: x => x,
  });
  const [showTrace, setShowTrace] = useState(true);
  const [speedLabel, speedSlider, speed] = useSlider({
    id: "speedCW", label: "Speed:",
    min: -40, max: 40,
    init: 6, transform: x => x/120,
  });
  return (
    <RoundsProvider speed={speed}>
      <ParameterTable>
        <tr>
          <td><label htmlFor="showOrigCW">Display original shape</label></td>
          <td style={{paddingLeft: "1em"}}>
            <input id="showOrigCW" type="checkbox"
              checked={showOrig}
              onChange={ev => setShowOrig(ev.target.checked)}
            />
          </td>
        </tr>
        <tr>
          <td>{nHandsLabel}</td>
          <td style={{padding: "0 1em"}}>{nHandsSlider}</td>
          <td>{nHands}</td>
        </tr>
        <tr>
          <td>{speedLabel}</td>
          <td style={{padding: "0 1em"}}>{speedSlider}</td>
          <td style={{width: "13em", height: "3em"}}>
            {speed === 0 ? "stopped" : (
              <>
                {(speed * 60).toFixed(1)} rounds per minute
                <br/>
                ({(1/speed).toFixed(2)} seconds per round)
              </>
            )}
          </td>
        </tr>
        <tr>
          <td>{machineryDisplayLabel}</td>
          <td style={{padding: "0 1em"}}>{machineryDisplaySlider}</td>
          <td style={{width: "7.5em"}}>{machineryDisplays[machineryDisplay]}</td>
        </tr>
        <tr>
          <td><label htmlFor="displayCW">Display trace:</label></td>
          <td style={{paddingLeft: "1em"}}>
            <input id="displayCW" type="checkbox"
              checked={showTrace}
              onChange={ev => setShowTrace(ev.target.checked)}
            />
          </td>
        </tr>
      </ParameterTable>
      <ConfigContext.Provider value={{nHands, showOrig, machineryDisplay, showTrace}}>
        <ClockworkGraphics fftFactory={fftFactory}/>
      </ConfigContext.Provider>
    </RoundsProvider>
  );
}

const ClockworkGraphics: FC<{fftFactory: FFTFactory}> = ({fftFactory}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathEl, setPathEl] = useState<SVGPathElement|null>(null);
  useEffect(() => {
    if (pathRef.current !== pathEl) {
      setPathEl(pathRef.current);
    }
  }, [pathRef, pathEl]);

  const {nHands} = useConfig();
  const [fft, setFFT] = useState<FFT>(() => fftFactory(size));
  useEffect(() => {
    setFFT(fftFactory(size));
  }, [fftFactory])

  const [center, setCenter] = useState<Complex>(() => zero);
  const [rotations, setRotations] = useState<Coeff[]>(() => []);
  const [approxPath, setApproxPath] = useState<Complex[]>(() => []);
  useEffect(() => {
    if (pathEl) {
      const step = pathEl.getTotalLength() / size;
      for (let i = 0; i < size; i++) {
        const p = pathEl.getPointAtLength(step * i);
        fft.setInput(i, {re: p.x, im: p.y});
      }
      fft.run();
      const scale = 1 / size;
      const coeffs = filledArray(size, (i): Coeff => {
        const k = i >= size / 2 ? i - size : i;
        const c = timesScalar(fft.getOutput(i), scale);
        const abs = Math.sqrt(abs2(c));
        return {k, c, abs};
      });

      setCenter(coeffs[0]?.c ?? zero);
      const rotations = coeffs.slice(1).sort((x, y) => x.abs - y.abs).slice(size - 1 - nHands);
      setRotations(rotations);
      for (let k = 0; k < size; k++)  fft.setInput(k, zero);
      for (const {k, c} of rotations) fft.setInput(k & (size - 1), c);
      fft.run(-1);
      setApproxPath(filledArray(size, i => fft.getOutput(i)));  
    }
  }, [pathEl, fft, nHands]);

  return (
    <svg width={450} height={390} viewBox="0 -0.4 7.5 6.5" style={{border: "1px solid black"}}>
      <path ref={pathRef}
        style={{stroke: useConfig().showOrig ? "blue": "none", strokeWidth: 0.05, fill: "none"}}
        // The following example path data is taken from https://de.wikipedia.org/wiki/Datei:Pi-CM.svg
        // with a small modification to work around Firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=1507603
        d="M3.37946 0.704598l1.47444 0c-0.352299,1.46139 -0.574116,2.4139 -0.574116,3.45775 0,0.182674 0,1.59404 0.534973,1.59404 0.274009,0 0.508875,-0.25009 0.508875,-0.471907 0,-0.065241 0,-0.0913388 -0.0913351,-0.287058 -0.352299,-0.900321 -0.3523,-2.02246 -0.352299,-2.11379 0,-0.0782899 0,-1.00471 0.274009,-2.17904l1.46139 0c0.169629,0 0.600214,0 0.600214,-0.41754 0,-0.287058 -0.247915,-0.287058 -0.482781,-0.287058l-4.29283 0c-0.300103,0 -0.743741,0 -1.34396,0.639357 -0.33925,0.378393 -0.75679,1.06995 -0.75679,1.14823 0,0.0782899 0.065241,0.104388 0.143531,0.104388 0.0913351,0 0.104384,-0.0391468 0.169625,-0.117433 0.6785,-1.06995 1.357,-1.06995 1.68321,-1.06995l0.743745 0c-0.287062,0.978607 -0.613263,2.11379 -1.68321,4.39721 -0.104384,0.208768 -0.104384,0.234866 -0.104384,0.313156 0,0.276184 0.234866,0.341425 0.352299,0.341425 0.378397,0 0.482781,-0.341425 0.639357,-0.889447 0.208772,-0.665455 0.208772,-0.691549 0.33925,-1.21347l0.75679 -2.94887z"
      />
      <Moving center={center} rotations={rotations} approxPath={approxPath}/>
    </svg>
  );
}

const Translate: FC<{offset: Complex}> = ({offset, children}) => (
  <g transform={`translate(${offset.re}, ${offset.im})`}>
    {children}
  </g>
);

const Moving: FC<{center: Complex, rotations: Coeff[], approxPath: Complex[]}> =
({center, rotations, approxPath}) => {
  const {machineryDisplay} = useConfig();
  const offset = useRounds(); // position measured in rounds
  const baseAngle = offset * TAU;  // position measured in radians
  return (
    <Translate offset={center}>
      {rotations.reduce(
        (children, {k, c, abs}) => {
          const offset = times(c, expi(k * baseAngle));
          return (
            <>
              {machineryDisplay >= 1 && (
                <>
                  <circle style={{fill: "black"}} r={0.02}/>
                  <line x1={0} y1={0} x2={offset.re} y2={offset.im} style={{stroke: "black", fill: "none", strokeWidth: 0.01}}/>
                  {machineryDisplay >= 2 && (
                    <circle style={{stroke: "green", fill: "none", strokeWidth: 0.01}} r={abs}/>
                  )}
                </>
              )}
              <Translate offset={offset}>
                {children}
              </Translate>
            </>
          );
        },
        <circle r={.05} style={{fill: "red"}}/>
      )}
      <FadingLoop path={approxPath} offset={offset}/>
    </Translate>
  );
};

const fadeOut = (x: number): number => x < .2 ? x * 5 : 1;

const FadingLoop: FC<{path: Complex[], offset: number}> = ({path, offset}) => {
  const stroke = useConfig().showTrace ? "red" : "none";
  return (
    <>
      {path.map((p, i) => {
        const p1 = path[(i-1+path.length) % path.length];
        const p2 = p;
        return (
          <line key={i}
            style={{
              stroke,
              strokeWidth: 0.05,
              strokeOpacity: fadeOut((1 + i/path.length - offset % 1) % 1),
              fill: 'none',
            }}
            x1={p1.re} y1={p1.im}
            x2={p2.re} y2={p2.im}
          />
        )
      })}
    </>
  );
};
