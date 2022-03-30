import { abs2, Complex, minus, timesScalar } from "complex/dst/Complex";
import { ComplexArray, getComplex, makeComplexArray, setComplex } from "complex/dst/ComplexArray";
import { makeTestData } from "./test-utils";
import { FC, Fragment, useState } from "react";
import styled from "styled-components";
import { SelectVersions, Table, TD, TDInput, TDOutput, TH } from "./utils";
import { versions } from "./versions";

const versionNames = Object.keys(versions);

type Result = {
  out: ComplexArray,
  ifft_fft: number,
  vs: Record<string, number>,
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

// empty-width field, making the left and right border appear as one fat border
const SeparatorField = styled(TD)`
  min-width: 0px;
  max-width: 0px;
  padding: 3px 0px;
`;

// empty-height field, making the top and bottom border appear as one fat border
const SeparatorRowField = styled.td`
  min-height: 0px;
  max-height: 0px;
  padding: 0;
`;

type TestFieldProps = {
  irrelevant?: boolean,
  equal?: boolean,
  warn?: boolean,
  error?: boolean,
  right?: boolean,
  width?: string,
};

const TestField = styled(TD)<TestFieldProps>`
  ${props => props.irrelevant ? "background: #ccc;" : ""}
  ${props => props.equal ? "background: #aaf;" : ""}
  ${props => props.warn  ? "background: #ff4;" : ""}
  ${props => props.error ? "background: #f44;" : ""}
  ${props => props.right ? "text-align: right;" : ""}
  padding: 3px 5px;
  ${props => props.width !== undefined ? `
    min-width: ${props.width};
    max-width: ${props.width};
  ` : ""}
`;

type DiffFieldProps = TestFieldProps & {
  children: number,
}

const DiffField: FC<DiffFieldProps> = ({children: diff, width, ...moreProps}) => (
  <TestField
    right width={width ?? "4.5em"}
    equal={diff === 0} warn={diff > 1e-15} error={diff > 1e-14}
    {...moreProps}
  >
    {diff === 0 ? "0" : diff.toExponential(3)}
  </TestField>
);

const Legend: FC<{}> = () => (
  <>
    <p>Legend:</p>
    <ul>
      <li><b>ifft∘fft</b><br/>
        Apply the FFT version to random input data and then the IFFT (inverse FFT) to
        the result.
        Compare the (scaled) result of the latter to the input data.
      </li>
      <li><b>vs. ...</b><br/>
        Compare the results of applying two FFT versions to (the same) random
        input data.
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
    const data = makeTestData(n);
    let results: Results = {};
    for (const [name, func] of Object.entries(versions)) {
      if (!testVersions[name]) continue;
      try {
        const fft = func(n);
        const out = makeComplexArray(n);
        fft(data, out, 1);
        // // just to see how exceptions and diffs are handled:
        // if (name==="fft06") setComplex(out, 0, timesScalar(getComplex(out, 0), 1.0001));
        // if (name==="fft07") throw "fooooo";
        const invOut = makeComplexArray(n);
        fft(out, invOut, -1);
        const scale = 1/n;
        results[name] = {
          out,
          ifft_fft: dist(n,
            i => getComplex(data, i),
            i => timesScalar(getComplex(invOut, i), scale),
          ),
          vs: {},
        };
      } catch (e) {
        results[name] = new Error(`Calculation failed: ${e}`);
      }
    }
    for (const name1 of versionNames) {
      const result1 = results[name1];
      if (!result1 || result1 instanceof Error)
        continue;
      const out1 = result1.out;
      for (const name2 of versionNames) {
        if (name2 >= name1) continue;
        const result2 = results[name2];
        if (!result2 || result2 instanceof Error)
          continue;
        const out2 = result2.out;
        const scale = Math.sqrt(1/n);
        const distance = dist(n,
          i => timesScalar(getComplex(out1, i), scale),
          i => timesScalar(getComplex(out2, i), scale),
        );
        result1.vs[name2] = distance;
        result2.vs[name1] = distance;
      }
    }
    setResults(results);
  }

  const resultEntries = Object.entries(results);

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
        Execute: {}
        <button
          onClick={runFFTs}
          disabled={!Object.values(testVersions).some(value => value)}
        >
          Run Tests
        </button>
      </p>
      <Table>
        <thead>
          <tr>
            <TH/>
            <SeparatorField/>
            <TH>ifft∘fft</TH>
            <SeparatorField/>
            {Object.keys(results).map(name2 => (
              <TH key={name2}>vs. {name2}</TH>
            ))}
          </tr>
          <tr>
            <SeparatorRowField colSpan={3 + resultEntries.length}/>
          </tr>
        </thead>
        <tbody>
          {resultEntries.map(([name, result]) => (
            <Fragment key={name}>
              <tr>
                <TH>{name}</TH>
                {result instanceof Error ? (
                  <TestField colSpan={2 + resultEntries.length} error>
                    {result.message}
                  </TestField>
                ) : (
                  <>
                    <SeparatorField/>
                    <DiffField>{result.ifft_fft}</DiffField>
                    <SeparatorField/>
                    {resultEntries.map(([name2, result2]) => (
                      <Fragment key={name2}>
                        {
                          name === name2           ? <TestField irrelevant/> :
                          result2 instanceof Error ? <TestField error/> :
                          <DiffField>{result.vs[name2]}</DiffField>
                        }
                      </Fragment>
                    ))}
                  </>
                )}
              </tr>
            </Fragment>
          ))}
        </tbody>
      </Table>
      <Legend/>
    </>
  );
};
