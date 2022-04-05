import { FC, Fragment, MutableRefObject, useRef, useState } from "react";
import styled from "styled-components";
import { Table, TD, TH } from "./utils";
import { SelectVersions } from "./SelectVersions";
import makeTestData from "./makeTestData";
import { TestableFFT, useVersions, VersionStates } from "./VersionContext";
import sleep from "./sleep";
import ParameterTable from "./ParameterTable";
import useSlider, { useBooleanSlider } from "./useSlider";

const blockSizes = [100, 200, 500, 1000, 2000, 5000, 10000];

type benchmarkState = number | "" | "pause" | "run";

type Results = Record<string, benchmarkState[]>;

type ComputeArgs = {
  thisCallCount: number,
  callCount: MutableRefObject<number>,
  versions: VersionStates,
  testVersions: Record<string, boolean>,
  nBlocks: number,
  pause: number,
  blockSize: number,
  n: number,
  backward: boolean,
  versionMajor: boolean,
  setResults: (value: Results) => void,
};

async function compute({
  thisCallCount, callCount,
  versions, testVersions,
  nBlocks, pause, blockSize, n, backward, versionMajor,
  setResults,
}: ComputeArgs): Promise<void> {
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
    const data = makeTestData(n);
    const results: Results =
      Object.fromEntries(
        Object.keys(versions)
        .filter((name) => testVersions[name])
        .map((name) => [name, new Array(nBlocks).fill("") as benchmarkState[]])
      );

    const runBlock = async (name: string, fft: TestableFFT, times: benchmarkState[], i: number) => {
      checkStop("A");
      if (pause > 0) {
        times[i] = "pause";
        setResults({...results});
        log("begin pause", name, i);
        await sleep(pause * 1e3);
        log("end pause", name, i);
        checkStop("B");
      }
      const start = performance.now();
      log("run", name, i);
      times[i] = "run";
      setResults({...results});
      await sleep(0);
      for (let j = 0; j < blockSize; j++) {
        fft.run(1);
      }
      checkStop("C");
      const time = (performance.now() - start) * 1e-3 / blockSize;
      times[i] = time;
      setResults({...results});
      await sleep(0);
    }
    const versionEntries =
      Object.entries(versions)
      .flatMap(([name, version]): {name: string, fft: TestableFFT, times: benchmarkState[]}[] => {
        if (version.status !== "resolved" || !testVersions[name]) {
          return [];
        }
        const times = results[name];
        const factory = version.value;
        const fft: TestableFFT = factory(n);
        data.forEach((v, i) => fft.setInput(i, v));
        return [{ name, fft, times }];
      });
    if (backward) {
      versionEntries.reverse();
    }
    if (versionMajor) {
      for (const { name, fft, times } of versionEntries) {
        for (let i = 0; i < nBlocks; i++) {
          await runBlock(name, fft, times, i);
        }
      }
    } else {
      for (let i = 0; i < nBlocks; i++) {
        for (const { name, fft, times } of versionEntries) {
          await runBlock(name, fft, times, i);
        }
      }
    }
    log("==== completed");
  } catch (e) {
    log(e);
  }
}

const BenchmarkField = styled(TD)`
  height: 2.8ex;
  width: 4em;
  text-align: right;
`;

const BenchmarkFieldCalls = styled(BenchmarkField)`
  background: #eee
`;

const visualizationModes = [
  "calls per second",
  "logarithmic",
  "time per call",
];

const visualizationModesBetter = [
  "better 🠖",
  "🠔 better",
  "🠔 better",
];

const getRange = (resultValues: benchmarkState[][]) => {
  const allTimes: number[] =
    resultValues.flatMap(states =>
      states.flatMap(state =>
        typeof(state) === "number" ? [state] : []
      )
    );
  return [Math.min(...allTimes), Math.max(...allTimes)];
}

const ResultsTable: FC<{results: Results}> = ({results}) => {
  const [visualizationModeIdx, setVisualizationModeIdx] = useState(2);

  const resultValues = Object.values(results);
  if (resultValues.length === 0) {
    return null;
  }
  const nBlocks = resultValues[0].length;
  const [fastest, slowest] = getRange(resultValues);

  return (
    <Table>
      <thead>
        <tr>
          <TH rowSpan={2}/>
          <TH colSpan={nBlocks}>
            time per call (in microseconds)
          </TH>
          <TD rowSpan={2} style={{verticalAlign: "top"}}>
            <input style={{transform: "rotate(-90deg)", width: "3em", height: "3em"}}
              type="range" min="0" max={visualizationModes.length - 1}
              value={visualizationModeIdx}
              onChange={event => setVisualizationModeIdx(Number(event.target.value))}
            />
            <div style={{display: "inline-block", width: "19em", textAlign: "center"}}>
              <b>{visualizationModes[visualizationModeIdx]}</b>
              <br/>
              {visualizationModesBetter[visualizationModeIdx]}
            </div>
          </TD>
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
              <TH rowSpan={2} left>{name}</TH>
              {times.map((time, j) => (
                <BenchmarkField key={j}>
                  {typeof(time) === "number" ? (time * 1e6).toFixed(1) : time}
                </BenchmarkField>
              ))}
              <TH rowSpan={2} style={{verticalAlign: "middle"}}>
                <svg viewBox="0 0 10 1" style={{width: "25em", height: "2.5em"}}>
                  {times.map((time, blockNo) => typeof(time) === "number" && (
                    <BlockVisualization
                      key={blockNo}
                      idx={visualizationModeIdx}
                      blockNo={blockNo} nBlocks={nBlocks}
                      time={time} fastest={fastest} slowest={slowest}
                    />
                  ))}
                </svg>
              </TH>
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
  );
};

const BlockVisualization: FC<{
  idx: number,
  blockNo: number, nBlocks: number,
  time: number, fastest: number, slowest: number,
}> = ({idx, blockNo, nBlocks, time, slowest, fastest}) => {
  if (fastest > slowest || (idx === 1 && fastest >= slowest)) {
    return null;
  }
  const y = (blockNo + 0.2) / nBlocks * 100 + "%";
  const height = 60 / nBlocks + "%";
  switch (idx) {
    case 0: return (
      <rect fill="lightgreen"
        y={y} height={height}
        x="0%" width={fastest / time * 100 + "%"}
      />
    );
    case 1:
      const logFastest = Math.log(fastest);
      const logSlowest = Math.log(slowest);
      const logTime = Math.log(time);
      const fraction = (logTime - logFastest) / (logSlowest - logFastest);
      return (
        <>
          <rect fill="darkred"
            y={y} height={height}
            x="0%" width={fraction * 100 + "%"}
          />
          <rect fill="lightgreen"
            y={y} height={height}
            x={fraction * 100 + "%"} width={(1 - fraction) * 100 + "%"}
          />
        </>
      );
    case 2: return (
      <rect fill="darkred"
        y={y} height={height}
        x="0%" width={time / slowest * 100 + "%"}
      />
    );
    default: return null;
  }
}

const Benchmark: FC = () => {
  const versions = useVersions();
  const [testVersions, setTestVersions] = useState<Record<string, boolean>>({});

  const [n, nRow] = useSlider({
    id: "nInput", label: "data size:",
    min: 0, max: 16,
    init: 11, transform: x => 1 << x,
  });
  const [nBlocks, nBlocksRow] = useSlider({
    id: "nBlocksInput", label: "number of blocks:",
    min: 1, max: 20,
    init: 2, transform: x => x,
  });
  const [blockSize, blockSizeRow] = useSlider({
    id: "blockSizeInput", label: "calls per block:",
    min: 0, max: blockSizes.length - 1,
    init: 4, transform: x => blockSizes[x],
  });
  const [pause, pauseRow] = useSlider({
    id: "pauseInput", label: "pause before each block (seconds):",
    min: 0, max: 60,
    init: 0, transform: x => x,
  });
  const [backward, directionRow] = useBooleanSlider({
    id: "backwardInput", label: "version execution order:",
    falseLabel: "forward", trueLabel: "backward",
    init: false,
  });
  const [versionMajor, nestingRow] = useBooleanSlider({
    id: "majorInput", label: "block execution order:",
    falseLabel: "a block for all versions", trueLabel: "all blocks for each version",
    init: false,
  });

  const [results, setResults] = useState<Results>({});

  const callCount = useRef(0);

  return (
    <>
      <p>Select the versions to benchmark:</p>
      <SelectVersions selected={testVersions} setSelected={setTestVersions}/>
      <p>Choose parameters:</p>
      <ParameterTable>
        {nRow}
        {blockSizeRow}
        {pauseRow}
        {nBlocksRow}
        {directionRow}
        {nestingRow}
      </ParameterTable>
      <p>
        Execute: {}
        <button
          onClick={() => compute({
            thisCallCount: ++callCount.current, callCount,
            versions, testVersions,
            nBlocks, pause, blockSize, n, backward, versionMajor,
            setResults,
          })}
          disabled={!Object.values(testVersions).some(value => value)}
        >
          Run Benchmarks
        </button>
        {} <button onClick={() => ++callCount.current}>Stop Benchmarks</button>
      </p>
      <ResultsTable {...{results}}/>
    </>
  );
};

export default Benchmark;
