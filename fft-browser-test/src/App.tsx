import './App.css';
import { ComplexArray, getComplex } from 'fft/dst/complex/ComplexArray';
import { FC, Fragment, useEffect, useState } from 'react';
import { getIndexedVersions } from './versions';
import { makeTestData } from 'fft/dst/test/utils';
import { abs2, Complex, minus, timesScalar } from 'fft/dst/complex/Complex';


const n = 1 << 11;
const data = makeTestData(n);

type Version = {
  actions: string,
  name: string,
  basedOn: string[],
  comment: string,
  func:
    (size: number, direction?: number) => Promise<
      (f: ComplexArray) => ComplexArray
    >,
};

type Result = {
  ifft_fft: number,
  vs_fft01: number,
  vs_bases: Record<string, number>,
};

type Results = Record<string, Result | Error>;

const dist = (f: (i: number) => Complex, g: (i: number) => Complex): number => {
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += abs2(minus(f(i), g(i)));
  }
  return Math.sqrt(sum / n);
}

function App() {
  const [indexedVersions, setIndexedVersions] = useState({} as Record<string, Version>);
  const [testVersions, setTestVersions] = useState({} as Record<string, boolean>);
  const [showComments, setShowComments] = useState(true);
  const [results, setResults] = useState({} as Results);
  useEffect(() => {
    async function getVersions() {
      const indexedVersions = await getIndexedVersions();
      setIndexedVersions(indexedVersions);
      const testVersions = Object.fromEntries(
        Object.values(indexedVersions)
        .map(({name, actions}) => [name, actions.includes("u")])
      );
      setTestVersions({...testVersions});
    }
    getVersions();
  }, []);
  useEffect(() => {
    // TODO fix/cleanup styling.  It's time to use StyledComponents.
    // TODO show benchmarks in addition/alternatively to correctness tests?
    // (Separate page?)
    // TODO Call benchmarks upon a button click, not upon each checkbox change
    // (Access testVersions via a useRef object?)
    // TODO use "t" and "b" instead of "u"?
    async function runFFTs() {
      if (!indexedVersions.fft01) {
        setResults({})
        return;
      }
      const fft01 = await indexedVersions.fft01.func(n);
      const out01 = fft01(data);
      let results: Results = {};
      for (const {name, basedOn, func} of Object.values(indexedVersions)) {
        if (!testVersions[name]) continue;
        try {
          const fft = await func(n);
          const ifft = await func(n, -1);
          const out = fft(data);
          const invOut = ifft(out);
          const scale = 1/n;
          const vs_bases: Record<string, number> = {};
          for (const base of basedOn) {
            const fftBase = await indexedVersions[base].func(n);
            const outBase = fftBase(data);
            vs_bases[base] = dist(
              i => getComplex(out, i),
              i => getComplex(outBase, i),
            );
          }
          results[name] = {
            name,
            ifft_fft: dist(
              i => getComplex(data, i),
              i => timesScalar(getComplex(invOut, i), scale),
            ),
            vs_fft01: dist(
              i => getComplex(out, i),
              i => getComplex(out01, i),
            ),
            vs_bases,
          };
        } catch (e) {
          results[name] = new Error(`Calculation failed: ${e}`);
        }
      }
      setResults(results);
    }
    runFFTs();
  }, [indexedVersions, testVersions]);

  return (
    <div className="App">
      <div style={{display: "flex", flexFlow: "row wrap"}}>
      {Object.values(indexedVersions).map(({name}) => (
        <label key={name} style={{flexBasis: "4em", whiteSpace: "nowrap"}}>
          <input type="checkbox"
            checked={Boolean(testVersions[name])}
            onChange={event => setTestVersions({
              ...testVersions,
              [name]: event.target.checked
            })}
          />
          {name}
        </label>
      ))}
      </div>
      <div>
        <label>
          <input type="checkbox"
            checked={showComments}
            onChange={event => setShowComments(event.target.checked)}
          />
          {} show comments
        </label>
      </div>
      <table className="results">
        <thead>
          <tr>
            <th>name</th>
            <th>ifft*fft</th>
            <th>vs. fft01</th>
            <th>vs. base(s)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(results).map(([name, result]) => (
            <Fragment key={name}>
              <tr>
                <td>{name}</td>
                {result instanceof Error ?
                  <ShowError key={name} error={result}/> :
                  <ShowResult key={name} result={result}/>
                }
              </tr>
              {showComments &&
                <tr>
                  <td colSpan={4} className="comment">
                    {indexedVersions[name].comment ?? "(comment missing)"}
                  </td>
                </tr>
              }
            </Fragment>
          ))}
        </tbody>
      </table>
      <Benchmark {...{indexedVersions, testVersions}}/>
    </div>
  );
}

const sleep = (ms: number): Promise<undefined> =>
  new Promise(resolve => setTimeout(resolve, ms));

const blockSizes = [100, 200, 500, 1000, 2000, 5000, 10000];

type benchmarkState = number | "" | "cooling" | "running";

const Benchmark: FC<{
  indexedVersions: Record<string, Version>,
  testVersions: Record<string, boolean>,
}> = ({
  indexedVersions, testVersions,
}) => {
  const [log2n, setLog2n] = useState(11);
  const n = 1 << log2n;
  const [nBlocks, setNBlocks] = useState(2);
  const [blockSizeIdx, setBlockSizeIdx] = useState(4);
  const blockSize = blockSizes[blockSizeIdx];
  const [coolDownTime, setCoolDownTime] = useState(0);
  const [results, setResults] = useState({} as Record<string, benchmarkState[]>);

  useEffect(
    () => {
      let stopped = false;
      async function compute() {
        console.log("==== start")
        const data = makeTestData(n);
        const results: Record<string, benchmarkState[]> =
          Object.fromEntries(
            Object.entries(indexedVersions)
            .filter(([name]) => testVersions[name])
            .map(([name]) => [name, new Array(nBlocks).fill("") as benchmarkState[]])
          );
        for (const {name, func} of Object.values(indexedVersions)) {
          if (!testVersions[name]) continue;
          console.log("testing version", name);
          const times = results[name];
          const fft = await func(n);
          console.log("got func")
          for (let i = 0; i < nBlocks; i++) {
            if (stopped) {
              console.log("==== stopping (A)")
              return;
            }
            if (coolDownTime > 0) {
              times[i] = "cooling";
              setResults({...results});
              console.log("cool down", name, i);
              await sleep(coolDownTime * 1e3 + 1);
              console.log("cooled down", name, i);
            }
            if (stopped) {
              console.log("==== stopping (B)")
              return;
            }
            const start = performance.now();
            console.log("run", name, i);
            times[i] = "running";
            setResults({...results});
            await sleep(0);
            for (let j = 0; j < blockSize; j++) {
              fft(data);
            }
            const end = performance.now();
            const time = (end - start) * 1e-3 / blockSize;
            if (stopped) {
              console.log("==== stopping (C)")
              return;
            }
            times[i] = time;
            setResults({...results});
            await sleep(0);
          }
        }
        console.log("==== completed");
      }
      compute();
      return () => {
        stopped = true;
      };
    },
    [indexedVersions, testVersions, n, nBlocks, blockSize, coolDownTime]
  )
  return (
    <>
      <table style={{margin: "1em 0"}}>
        <tbody>
          <tr>
            <td>{n}</td>
            <td>
              <input id="nInput" type="range"
                min={0} max={16}
                value={log2n}
                onChange={event => setLog2n(Number(event.target.value))}
              />
            </td>
            <td>
              <label htmlFor="nInput">data size</label>
            </td>
          </tr>
          <tr>
            <td>{nBlocks}</td>
            <td>
              <input id="nBlocksInput" type="range"
                min={1} max={20}
                value={nBlocks}
                onChange={event => setNBlocks(Number(event.target.value))}
              />
            </td>
            <td>
              <label htmlFor="nBlocksInput">number of blocks</label>
            </td>
          </tr>
          <tr>
            <td style={{width: "3em"}}>{blockSize}</td>
            <td>
              <input id="blockSizeInput" type="range"
                min={0} max={blockSizes.length - 1}
                value={blockSizeIdx}
                onChange={event => setBlockSizeIdx(Number(event.target.value))}
              />
            </td>
            <td>
              <label htmlFor="blockSizeInput">calls per block</label>
            </td>
          </tr>
          <tr>
            <td style={{width: "3em"}}>{coolDownTime}</td>
            <td>
              <input id="coolDownTimeInput" type="range"
                min={0} max={60}
                value={coolDownTime}
                onChange={event => setCoolDownTime(Number(event.target.value))}
              />
            </td>
            <td>
              <label htmlFor="coolDownTimeInput">
                cool-down time (seconds) between blocks
              </label>
            </td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th rowSpan={2}>name</th>
            <th colSpan={nBlocks}>time per call (in microseconds)</th>
          </tr>
          <tr>
            <th colSpan={nBlocks}>calls per second</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(results).map(([name, times]) => (
            <Fragment key={name}>
              <tr>
                <td rowSpan={2}>{name}</td>
                {times.map((time, j) => (
                  <td key={j} style={{height: "2.8ex", width: "4em"}}>
                    {typeof(time) === "number" ? (time * 1e6).toFixed(1) : time}
                  </td>
                ))}
              </tr>
              <tr>
                {times.map((time, j) => (
                  <td key={j} style={{height: "2.8ex", width: "4em", background: "#eee"}}>
                    {typeof(time) === "number" ? (1/time).toFixed() : ""}
                  </td>
                ))}
              </tr>
            </Fragment>
        ))}
        </tbody>
      </table>
    </>
  );
}

const Diff: FC<{className?: string, diff: number}> = ({className, diff}) => (
  <td className={className + (diff > 1e-13 ? " bigdiff" : "")}>
    {(diff*1e16).toFixed(3) + "e-16"}
  </td>
);

const ShowResult: FC<{result: Result}> = ({result}) => (
  <>
    <Diff diff={result.ifft_fft}/>
    <Diff diff={result.vs_fft01}/>
    <td style={{padding: 0}}>
      <table className="bases">
        <tbody>
          {Object.entries(result.vs_bases).map(([k, v], i) => (
            <tr key={k}>
              <td className={"baseName" + (i === 0 ? " firstBase" : "")}>vs. {k}</td>
              <Diff className={"baseDiff" + (i === 0 ? " firstBase" : "")} diff={v}/>
            </tr>
          ))}
        </tbody>
      </table>
    </td>
  </>
);

const ShowError: FC<{error: Error}> = ({error}) => (
  <td colSpan={4} className="error">
    {error.message}
  </td>
);

export default App;
