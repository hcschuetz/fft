import { abs2, Complex, minus, timesScalar } from "fft/dst/complex/Complex";
import { getComplex } from "fft/dst/complex/ComplexArray";
import { makeTestData } from "fft/dst/test/utils";
import { FC, Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import { SelectVersions, Table, TD, TDInput, TDOutput, TH } from "./utils";
import { Version } from "./versions";

type Result = {
  ifft_fft: number,
  vs_fft01: number,
  vs_bases: Record<string, number>,
};

type Results = Record<string, Result | Error>;

const dist = (
  n: number,
  f: (i: number) => Complex,
  g: (i: number) => Complex,
): number => {
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += abs2(minus(f(i), g(i)));
  }
  return Math.sqrt(sum / n);
}

type TestFieldProps = {
  warn?: boolean,
  error?: boolean,
  noTopBorder?: boolean,
  noRightBorder?: boolean,
  noBottomBorder?: boolean,
  noLeftBorder?: boolean,
  padding?: string,
  right?: boolean,
  width?: string,
};

const TestField = styled(TD)<TestFieldProps>`
  ${props => props.right ? "text-align: right;" : ""}
  ${props => props.warn  ? "background: #ff4;" : ""}
  ${props => props.error ? "background: #f44;" : ""}
  border-width:
    ${props => props.noTopBorder ? "0" : "1px"}
    ${props => props.noRightBorder ? "0" : "1px"}
    ${props => props.noBottomBorder ? "0" : "1px"}
    ${props => props.noLeftBorder ? "0" : "1px"};
  padding: ${props => props.padding ?? "3px 5px"};
  ${props => props.width !== undefined ? `
    min-width: ${props.width};
    max-width: ${props.width};
  ` : ""}
`;

type DiffFieldProps = TestFieldProps & {
  children: number,
}

const DiffField: FC<DiffFieldProps> = ({children: diff, width, ...moreProps}) => (
  <TestField right width={width ?? "6em"} warn={diff > 1e-14} {...moreProps}>
    {(diff * 1e16).toFixed(3) + "e-16"}
  </TestField>
);

const ShowResult: FC<{result: Result | Error}> = ({result}) =>
  result instanceof Error ? (
    <TestField colSpan={4} error={true}>
      {result.message}
    </TestField>
  ) : (
    <>
      <DiffField>{result.ifft_fft}</DiffField>
      <DiffField>{result.vs_fft01}</DiffField>
      <TestField padding="0">
        <Table>
          <tbody>
            {Object.entries(result.vs_bases).map(([k, v], i, a) => (
              <tr key={k}>
                <TestField
                  noTopBorder={i === 0}
                  noBottomBorder={i === a.length - 1}
                  noLeftBorder
                  width="5em"
                >vs. {k}</TestField>
                <DiffField
                  noTopBorder={i === 0}
                  noBottomBorder={i === a.length - 1}
                  noRightBorder
                >{v}</DiffField>
              </tr>
            ))}
          </tbody>
        </Table>
      </TestField>
    </>
  );

const Legend: FC<{}> = () => (
  <>
    <p>Legend:</p>
    <ul>
      <li><b>ifft*fft</b><br/>
        Apply the FFT version to random input data and then the inverse FFT to
        the result.
        Compare the (scaled) result of the latter to the input data.
      </li>
      <li><b>vs. fft01</b><br/>
        Apply both the FFT version and fft01 (the reference version)
        to random input data.
        Compare the two results.
      </li>
      <li><b>vs. base(s)</b><br/>
        An FFT implementation version may be based on one or more other FFT
        versions.
        Compare the result of the current FFT version to the result(s) of the
        base version(s).
      </li>
    </ul>
    <p>
      "Comparing" two complex arrays means that we compute some distance.
      These distances should be small and explainable by roundoff
      differences due to limited numeric precision.
    </p>
  </>
);

export const Tests: FC<{indexedVersions: Record<string, Version>}> = ({indexedVersions}) => {
  const [testVersions, setTestVersions] = useState({} as Record<string, boolean>);
  const [log2n, setLog2n] = useState(11);
  const n = 1 << log2n;
  const [results, setResults] = useState({} as Results);
  useEffect(() => {
    setTestVersions(
      Object.fromEntries(
        Object.values(indexedVersions)
        .map(({name, actions}) => [name, actions.includes("t")])
      )
    );
  }, [indexedVersions]);

  async function runFFTs() {
    if (!indexedVersions.fft01) {
      setResults({})
      return;
    }
    const data = makeTestData(n);
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
          vs_bases[base] = dist(n,
            i => getComplex(out, i),
            i => getComplex(outBase, i),
          ) / Math.sqrt(n); // equivalent to scaling out and outBase
        }
        results[name] = {
          name,
          ifft_fft: dist(n,
            i => getComplex(data, i),
            i => timesScalar(getComplex(invOut, i), scale),
          ),
          vs_fft01: dist(n,
            i => getComplex(out, i),
            i => getComplex(out01, i),
          ) / Math.sqrt(n), // equivalent to scaling out and out01
          vs_bases,
        };
      } catch (e) {
        results[name] = new Error(`Calculation failed: ${e}`);
      }
    }
    setResults(results);
  }

  return (
    <>
      <p>Select the versions to test:</p>
      <SelectVersions {...{indexedVersions, testVersions, setTestVersions}}/>
      <p>Choose parameter:</p>
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
        </tbody>
      </table>
      <p>
        Execute: <button onClick={runFFTs}>Run Tests</button>
      </p>
      <Table>
        <thead>
          <tr>
            <TH>name</TH>
            <TH>ifft*fft</TH>
            <TH>vs. fft01</TH>
            <TH>vs. base(s)</TH>
          </tr>
        </thead>
        <tbody>
          {Object.entries(results).map(([name, result]) => (
            <Fragment key={name}>
              <tr>
                <TD>{name}</TD>
                <ShowResult result={result}/>
              </tr>
            </Fragment>
          ))}
        </tbody>
      </Table>
      <Legend/>
    </>
  );
};
