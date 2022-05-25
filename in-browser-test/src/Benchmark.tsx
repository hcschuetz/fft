import { FC, Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import { Table, TD, TH } from "./utils";
import { SelectVersions } from "./SelectVersions";
import { useVersions } from "./VersionContext";
import ParameterTable from "./ParameterTable";
import useSlider, { useBooleanSlider } from "./useSlider";
import { BenchmarkState, ComputeArgs, WorkerMessage } from "./benchmark-worker-interface";

const blockSizes = [100, 200, 500, 1000, 2000, 5000, 10000];

type Results = Record<string, BenchmarkState[]>;

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

const getRange = (resultValues: BenchmarkState[][]) => {
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
    <>
      <Table>
        <thead>
          <tr>
            <TH rowSpan={2}/>
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
            <TH colSpan={nBlocks}>
              time per call (in microseconds)
            </TH>
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
                    <Median idx={visualizationModeIdx} {...{times, slowest, fastest}}/>
                  </svg>
                </TH>
                {times.map((time, j) => (
                  <BenchmarkField key={j}>
                    {typeof(time) === "number" ? (time * 1e6).toFixed(1) : time}
                  </BenchmarkField>
                ))}
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
      <details>
        <summary>Legend:</summary>
        <div className="details-body">
          <p>
            For each block the average duration of a call and
            the (theoretical) number of calls per second
            are computed and written to the table.
          </p>
          <p>
            The block results are visualized in a bar chart
            grouped by the FFT versions.
          </p>
          <p>
            You can use the slider in the table header to select the values
            represented by the bars:
          </p>
          <ul>
            <li>
              The average time needed for a call in the block (red),
            </li>
            <li>
              the (theoretical) number of calls per second (green),
            </li>
            <li>
              or both values on a logarithmic scale.
            </li>
          </ul>
          <p>
            The scale is adapted to the actual results.
            Therefore only the relative bar sizes are significant.
          </p>
          <p>
            As soon as a bar chart section for an FFT version has more than one bar,
            the median is displayed as a vertical line.
          </p>
        </div>
      </details>
    </>
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

const Median: FC<{
  idx: number, slowest: number, fastest: number, times: BenchmarkState[],
}> = ({
  idx, slowest, fastest, times,
}) => {
  if (fastest > slowest || (idx === 1 && fastest >= slowest)) {
    return null;
  }
  const numbers = times.filter(t => typeof(t) === "number") as number[];
  const len = numbers.length
  // A median for len === 1 exists, but its's just that single value:
  if (len < 2) return null;

  numbers.sort();
  const median =
    len % 2 === 1
    ? numbers[(len - 1) / 2]
    // Notice that this is the geometric mean, not the arithmetic one:
    : Math.sqrt(numbers[len / 2 - 1] * numbers[len / 2]);
  const fraction =
    idx === 0 ? fastest / median :
    idx === 1 ? (Math.log(median) - Math.log(fastest)) / (Math.log(slowest) - Math.log(fastest)):
    idx === 2 ? median / slowest :
    0; // should not occur
  const x = `${fraction * 100}%`;
  return <line stroke="black" strokeWidth="0.3%" x1={x} y1="0%" x2={x} y2="100%"/>
}

const NumBlock = styled.div`
  width: 3em;
  text-align: right;
`;

const Benchmark: FC = () => {
  const versions = useVersions();
  const [testVersions, setTestVersions] = useState<Record<string, boolean>>({});

  const [nLabel, nSlider, n] = useSlider({
    id: "nSlider", label: "Data size:",
    min: 0, max: 16,
    init: 11, transform: x => 1 << x,
  });
  const [blockSizeLabel, blockSizeSlider, blockSize] = useSlider({
    id: "blockSizeSlider", label: "Calls per block:",
    min: 0, max: blockSizes.length - 1,
    init: 4, transform: x => blockSizes[x],
  });
  const [nBlocksLabel, nBlocksSlider, nBlocks] = useSlider({
    id: "nBlocksSlider", label: "number of blocks:",
    min: 1, max: 20,
    init: 10, transform: x => x,
  });
  const [pauseLabel, pauseSlider, pause] = useSlider({
    id: "pauseSlider", label: "pause before each block:",
    min: 0, max: 60,
    init: 0, transform: x => x,
  });
  const [directionLabel, directionSlider, backward] = useBooleanSlider({
    id: "directionSlider", label: "version execution order:",
    falseLabel: "forward", trueLabel: "backward",
    init: false,
  });
  const [nestingLabel, nestingSlider, versionMajor] = useBooleanSlider({
    id: "nestingSlider", label: "block execution for versions:",
    falseLabel: "a block at a time", trueLabel: "all blocks at once",
    init: false,
  });

  const [results, setResults] = useState<Results>({});

  const makeWorker = () => 
    new Worker(new URL("./benchmark-worker", import.meta.url));
  const [worker, setWorker] = useState(makeWorker);
  useEffect(() => () => worker.terminate(), [worker]);

  const [busy, setBusy] = useState(false);

  function replaceWorkerIfBusy() {
    if (busy) {
      const newWorker = makeWorker();
      setWorker(newWorker);
      setBusy(false);
      return newWorker;
    } else {
      return worker;
    }
  }

  async function compute(): Promise<void> {
    const worker = replaceWorkerIfBusy();
    const testVersionList: string[] =
      Object.entries(versions).flatMap(([name, version]) =>
        version.status === "resolved" && testVersions[name] ? [name] : []
      );
  
    const results: Results = Object.fromEntries(
      testVersionList.map(name => [name, new Array(nBlocks).fill("") as BenchmarkState[]])
    );
    setResults(results);
  
    if (backward) {
      testVersionList.reverse();
    }

    worker.onmessage = ({data}: {data: WorkerMessage}) => {
      switch (data.type) {
        case "value": {
          const { version, blockNo, value } = data;
          results[version][blockNo] = value;
          setResults({...results});
          break;
        }
        case "done": {
          setBusy(false);
          break;
        }
      }
    };

    const message: ComputeArgs =
      {testVersionList, nBlocks, pause, blockSize, n, versionMajor};
    setBusy(true);
    worker.postMessage(message);
  }
  
  return (
    <>
      <SelectVersions selected={testVersions} setSelected={setTestVersions}>
        Select the versions to benchmark:
      </SelectVersions>
      <details>
        <summary>Choose parameters:</summary>
        <div className="details-body">
          <p>
            Due to limited clock precision calculation time is measured for
            blocks consisting of multiple FFT invocations
            and then divided by the number of calls.
          </p>
          <p>
            Most FFT implementations consist of
          </p>
          <ul>
            <li>
              a "preparation phase" where, for example,
              the needed cosine values are tabulated,
              and which runs before the FFT input data is known,
            </li>
            <li>
              and an "execution phase" which runs on the actual input data.
            </li>
          </ul>
          <p>
            Our benchmarks measure only the execution phase.
            This fits with the typical use case where many sections of a continuous
            signal are processed by a FFT that is prepared only once.
          </p>
          <p>
            For each selected version a benchmark can run several blocks.
            This allows to observe certain effects:
          </p>
          <ul>
            <li>
              Just-in-time JavaScript compilers consume some time, but only once.
            </li>
            <li>
              Furthermore JS code is typically processed in a less efficient way
              for a while
              before JS engines decide to apply aggressive optimizations.
            </li>
            <li>
              While these effects may lead to a speed-up over time,
              there is also a slow-down effect:
              CPUs may heat up by heavy usage, which causes the system to
              throttle the clock rate.
            </li>
          </ul>
          <p>
            We cannot observe these effects directly,
            but several parameters help to get an idea of the impact:
          </p>
          <ul>
            <li>
              The benchmark can be paused for a number of seconds before each block.
              This allows the processor to cool down and to use a higher clock rate again.
            </li>
            <li>
              We can process the FFT versions in reverse order so that it's not
              always the later versions that have to suffer from CPU heating
              caused by the earlier versions.
            </li>
            <li>
              We can run all blocks for a version at once or we can run
              the first block for each version,
              then the second block for each version, etc.
              <br/>
              The second approach also gives us a quick first comparison between
              the versions while later blocks are still pending.
            </li>
          </ul>
          <p>
            Do not hesitate to select a high number of blocks (per version).

          </p>
        </div>
      </details>
      <ParameterTable>
        <tr>
          <td>{nLabel}</td>
          <td style={{padding: "0 1em"}}>{nSlider}</td>
          <td><NumBlock>{n}</NumBlock></td>
        </tr>
        <tr>
          <td>{blockSizeLabel}</td>
          <td style={{padding: "0 1em"}}>{blockSizeSlider}</td>
          <td><NumBlock>{blockSize}</NumBlock></td>
        </tr>
        <tr>
          <td>{nBlocksLabel}</td>
          <td style={{padding: "0 1em"}}>{nBlocksSlider}</td>
          <td><NumBlock>{nBlocks}</NumBlock></td>
        </tr>
        <tr>
          <td>{pauseLabel}</td>
          <td style={{padding: "0 1em"}}>{pauseSlider}</td>
          <td><NumBlock>{pause} s</NumBlock></td>
        </tr>
        <tr>
          <td>{directionLabel}</td>
          <td colSpan={2} style={{paddingLeft: "1em"}}>{directionSlider}</td>
        </tr>
        <tr>
          <td>{nestingLabel}</td>
          <td colSpan={2} style={{paddingLeft: "1em"}}>{nestingSlider}</td>
        </tr>
      </ParameterTable>
      <p>
        Execute: {}
        <button
          onClick={compute}
          disabled={!Object.values(testVersions).some(value => value)}
        >
          Run Benchmarks
        </button>
        {} <button
          onClick={() => { replaceWorkerIfBusy(); }}
          disabled={!busy}
        >Stop Benchmarks</button>
      </p>
      <ResultsTable {...{results}}/>
    </>
  );
};

export default Benchmark;
