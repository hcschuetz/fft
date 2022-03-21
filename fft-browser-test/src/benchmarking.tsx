import { makeTestData } from "fft/dst/test/utils";
import { FC, Fragment, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { SelectVersions, Table, TD, TDInput, TDOutput, TH } from "./utils";
import { Version } from "./versions";

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

export const Benchmark: FC<{indexedVersions: Record<string, Version>}> = ({indexedVersions}) => {
  const [testVersions, setTestVersions] = useState({} as Record<string, boolean>);
  const [log2n, setLog2n] = useState(11);
  const n = 1 << log2n;
  const [nBlocks, setNBlocks] = useState(2);
  const [blockSizeIdx, setBlockSizeIdx] = useState(4);
  const blockSize = blockSizes[blockSizeIdx];
  const [coolDownTime, setCoolDownTime] = useState(0);
  const [results, setResults] = useState({} as Record<string, benchmarkState[]>);

  useEffect(
    () => {
      setTestVersions(
        Object.fromEntries(
          Object.values(indexedVersions)
          .map(({name, actions}) => [name, actions.includes("b")])
        )
      );
    },
    [indexedVersions],
  )

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
      const data = makeTestData(n);
      const results: Record<string, benchmarkState[]> =
        Object.fromEntries(
          Object.entries(indexedVersions)
          .filter(([name]) => testVersions[name])
          .map(([name]) => [name, new Array(nBlocks).fill("") as benchmarkState[]])
        );
      for (const {name, func} of Object.values(indexedVersions)) {
        if (!testVersions[name]) continue;
        log("testing version", name);
        const times = results[name];
        const fft = await func(n);
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
            fft(data);
          }
          checkStop("C");
          times[i] = (performance.now() - start) * 1e-3 / blockSize;
          setResults({...results});
          await sleep(0);
        }
      }
      log("==== completed");
    } catch (e) {
      log(e);
    }
  }

  return (
    <>
      <p>Select the versions to benchmark:</p>
      <SelectVersions {...{indexedVersions, testVersions, setTestVersions}}/>
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
        Execute:
        {} <button onClick={() => compute(++callCount.current)}>Run Benchmarks</button>
        {} <button onClick={() => ++callCount.current}>Stop Benchmarks</button>
      </p>
      <Table>
        <thead>
          <tr>
            <TH rowSpan={2}>name</TH>
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
                <TD rowSpan={2}>{name}</TD>
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
    </>
  );
};
