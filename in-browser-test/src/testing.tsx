import { abs2, Complex, minus, timesScalar } from "complex/dst/Complex";
import { getComplex, makeComplexArray } from "complex/dst/ComplexArray";
import { makeTestData } from "./test-utils";
import { FC, Fragment, useState } from "react";
import styled from "styled-components";
import { SelectVersions, Table, TD, TDInput, TDOutput, TH } from "./utils";
import { versions } from "./versions";

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
    <TestField colSpan={2} error={true}>
      {result.message}
    </TestField>
  ) : (
    <>
      <DiffField>{result.ifft_fft}</DiffField>
      <DiffField>{result.vs_fft01}</DiffField>
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
    </ul>
    <p>
      "Comparing" two complex arrays means that we compute some distance.
      These distances should be small and explainable by roundoff
      differences due to limited numeric precision.
    </p>
  </>
);

export const Tests: FC = () => {
  const [testVersions, setTestVersions] = useState({} as Record<string, boolean>);
  const [log2n, setLog2n] = useState(11);
  const n = 1 << log2n;
  const [results, setResults] = useState({} as Results);

  async function runFFTs() {
    if (!versions.fft01) {
      setResults({})
      return;
    }
    const data = makeTestData(n);
    const fft01 = versions.fft01(n);
    const out01 = makeComplexArray(n);
    fft01(data, out01, 1);
    let results: Results = {};
    for (const [name, func] of Object.entries(versions)) {
      if (!testVersions[name]) continue;
      try {
        const fft = func(n);
        const out = makeComplexArray(n);
        fft(data, out, 1);
        const invOut = makeComplexArray(n);
        fft(out, invOut, -1);
        const scale = 1/n;
        const vs_bases: Record<string, number> = {};
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
      <SelectVersions selected={testVersions} setSelected={setTestVersions}/>
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
