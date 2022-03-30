import { makeTestData } from "./test-utils";
import { FC, Fragment, useRef, useState } from "react";
import styled from "styled-components";
import { SelectVersions, Table, TD, TDInput, TDOutput, TH } from "./utils";
import { versions } from "./versions";
import { makeComplexArray } from "complex/dst/ComplexArray";

const sleep = (ms: number): Promise<undefined> =>
  new Promise(resolve => setTimeout(resolve, ms));

const blockSizes = [100, 200, 500, 1000, 2000, 5000, 10000];

type benchmarkState = number | "" | "cooling" | "running";

const BenchmarkField = styled(TD)`
  height: 2.8ex;
  width: 4em;
  text-align: right;
`;

const BenchmarkFieldCalls = styled(BenchmarkField)`
  background: #eee
`;

const visualizationModes = [
  "time per call (shorter is better)",
  "logarithmic (greener is better)",
  "calls per second (longer is better)",
];

export const Benchmark: FC = () => {
  const [testVersions, setTestVersions] = useState({} as Record<string, boolean>);

  const [log2n, setLog2n] = useState(11);
  const n = 1 << log2n;

  const [nBlocks, setNBlocks] = useState(2);

  const [blockSizeIdx, setBlockSizeIdx] = useState(4);
  const blockSize = blockSizes[blockSizeIdx];

  const [coolDownTime, setCoolDownTime] = useState(0);
  const [results, setResults] = useState({} as Record<string, benchmarkState[]>);

  const initialRange = {fastest: Number.POSITIVE_INFINITY, slowest: 0};
  const [range, setRange] = useState(initialRange);
  const resetRange = () => setRange(initialRange);
  const adaptRange = (time: number): void =>
    setRange(({fastest, slowest}) => ({
      fastest: Math.min(fastest, time),
      slowest: Math.max(slowest, time),
    }));

  const [visualizationModeIdx, setVisualizationModeIdx] = useState(0);

  const callCount = useRef(0);

  async function compute(thisCallCount: number): Promise<void> {
    function log(...args: any[]) {
      console.log(`[${thisCallCount}|${callCount.current}]`, ...args);
    }

    function checkStop(tag: string) {
      if (callCount.current !== thisCallCount) {
        // eslint-disable-next-line no-throw-literal
        throw `==== stopping (${tag})`;
      }
    }

    try {
      log("==== start");
      resetRange();
      const data = makeTestData(n);
      const out = makeComplexArray(n);
      const results: Record<string, benchmarkState[]> =
        Object.fromEntries(
          Object.keys(versions)
          .filter((name) => testVersions[name])
          .map((name) => [name, new Array(nBlocks).fill("") as benchmarkState[]])
        );
      for (const [name, fft_prepare] of Object.entries(versions)) {
        if (!testVersions[name]) continue;
        log("testing version", name);
        const times = results[name];
        const fft = fft_prepare(n);
        log("got func")
        for (let i = 0; i < nBlocks; i++) {
          checkStop("A");
          if (coolDownTime > 0) {
            times[i] = "cooling";
            setResults({...results});
            log("cool down", name, i);
            await sleep(coolDownTime * 1e3);
            log("cooled down", name, i);
            checkStop("B");
          }
          const start = performance.now();
          log("run", name, i);
          times[i] = "running";
          setResults({...results});
          await sleep(0);
          for (let j = 0; j < blockSize; j++) {
            fft(data, out, 1);
          }
          checkStop("C");
          const time = (performance.now() - start) * 1e-3 / blockSize;
          times[i] = time;
          adaptRange(time);
          setResults({...results});
          await sleep(0);
        }
      }
      log("==== completed");
    } catch (e) {
      log(e);
    }
  }

  const {fastest, slowest} = range;
  const haveRange = fastest < slowest;

  return (
    <>
      <p>Select the versions to benchmark:</p>
      <SelectVersions selected={testVersions} setSelected={setTestVersions}/>
      <p>Choose parameters:</p>
      <table style={{
        margin: "1em 0",
        borderCollapse: "collapse",
        border: "1em 0",
      }}>
        <tbody>
          <tr>
            <td>
              <label htmlFor="nInput">data size:</label>
            </td>
            <TDInput>
              <input id="nInput" type="range"
                min={0} max={16}
                value={log2n}
                onChange={event => setLog2n(Number(event.target.value))}
              />
            </TDInput>
            <TDOutput>{n}</TDOutput>
          </tr>
          <tr>
            <td>
              <label htmlFor="nBlocksInput">number of blocks:</label>
            </td>
            <TDInput>
              <input id="nBlocksInput" type="range"
                min={1} max={20}
                value={nBlocks}
                onChange={event => setNBlocks(Number(event.target.value))}
              />
            </TDInput>
            <TDOutput>{nBlocks}</TDOutput>
          </tr>
          <tr>
            <td>
              <label htmlFor="blockSizeInput">calls per block:</label>
            </td>
            <TDInput>
              <input id="blockSizeInput" type="range"
                min={0} max={blockSizes.length - 1}
                value={blockSizeIdx}
                onChange={event => setBlockSizeIdx(Number(event.target.value))}
              />
            </TDInput>
            <TDOutput>{blockSize}</TDOutput>
          </tr>
          <tr>
            <td>
              <label htmlFor="coolDownTimeInput">
                cool-down time (seconds) between blocks:
              </label>
            </td>
            <TDInput>
              <input id="coolDownTimeInput" type="range"
                min={0} max={60}
                value={coolDownTime}
                onChange={event => setCoolDownTime(Number(event.target.value))}
              />
            </TDInput>
            <TDOutput>{coolDownTime}</TDOutput>
          </tr>
        </tbody>
      </table>
      <p>
        Execute: {}
        <button
          onClick={() => compute(++callCount.current)}
          disabled={!Object.values(testVersions).some(value => value)}
        >
          Run Benchmarks
        </button>
        {} <button onClick={() => ++callCount.current}>Stop Benchmarks</button>
      </p>
      <Table>
        <thead>
          <tr>
            <TH rowSpan={2}/>
            <TH colSpan={nBlocks}>
              time per call (in microseconds)
            </TH>
            {haveRange && <TH rowSpan={2}>
              {visualizationModes[visualizationModeIdx]}
              <br/>
              <input type="range" min="0" max={visualizationModes.length - 1}
                value={visualizationModeIdx}
                onChange={event => setVisualizationModeIdx(Number(event.target.value))}
              />
            </TH>}
          </tr>
          <tr>
            <TH colSpan={nBlocks} style={{background: "#eee"}}>
              calls per second
            </TH>
          </tr>
        </thead>
        <tbody>
          {Object.entries(results).map(([name, times]) => (
            <Fragment key={name}>
              <tr>
                <TH rowSpan={2}>{name}</TH>
                {times.map((time, j) => (
                  <BenchmarkField key={j}>
                    {typeof(time) === "number" ? (time * 1e6).toFixed(1) : time}
                  </BenchmarkField>
                ))}
                {haveRange &&
                  <TH rowSpan={2} style={{padding: 5}}>
                    <NBlocksVisualization
                      idx={visualizationModeIdx}
                      times={times}
                      fastest={fastest}
                      slowest={slowest}
                    />
                  </TH>
                }
              </tr>
              <tr>
                {times.map((time, j) => (
                  <BenchmarkFieldCalls key={j}>
                    {typeof(time) === "number" ? (1/time).toFixed() : ""}
                  </BenchmarkFieldCalls>
                ))}
              </tr>
            </Fragment>
        ))}
        </tbody>
      </Table>
    </>
  );
};

const NBlocksVisualization: FC<{
  idx: number,
  times: benchmarkState[],
  fastest: number,
  slowest: number,
}> = ({idx, times, slowest, fastest}) => {
  switch (idx) {
    case 0:
      return (
        <svg viewBox="0 0 10 1" style={{width: "30em", height: "3em"}}>
          {times.map((time, blockNo) => typeof(time) === "number" && (
            <rect
              x="0%"
              y={(blockNo + 0.2) / times.length * 100 + "%"}
              width={time / slowest * 100 + "%"}
              height={60 / times.length + "%"}
              fill="darkred"
            />
          ))}
        </svg>
      );
    case 1:
      return (
        <svg viewBox="0 0 10 1" style={{width: "30em", height: "3em"}}>
          {times.map((time, blockNo) => {
            if (typeof(time) !== "number") return null;
            const logFastest = Math.log(fastest);
            const logSlowest = Math.log(slowest);
            const logTime = Math.log(time);
            const fraction = (logTime - logFastest) / (logSlowest - logFastest);
            return (
              <>
                <rect
                  x="0%"
                  y={(blockNo + 0.2) / times.length * 100 + "%"}
                  width={fraction * 100 + "%"}
                  height={60 / times.length + "%"}
                  fill="darkred"
                />
                <rect
                  x={fraction * 100 + "%"}
                  y={(blockNo + 0.2) / times.length * 100 + "%"}
                  width={(1 - fraction) * 100 + "%"}
                  height={60 / times.length + "%"}
                  fill="lightgreen"
                />
              </>
            );
          })}
        </svg>
      );
    case 2:
      return (
        <svg viewBox="0 0 10 1" style={{width: "30em", height: "3em"}}>
          {times.map((time, blockNo) => typeof(time) === "number" && (
            <rect
              x="0%"
              y={(blockNo + 0.2) / times.length * 100 + "%"}
              width={fastest / time * 100 + "%"}
              height={60 / times.length + "%"}
              fill="lightgreen"
            />
          ))}
        </svg>
      );
    default: return null;
  }
}