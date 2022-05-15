import { abs2, Complex, minus, timesScalar } from "complex/dst/Complex";
import { FC, Fragment, useState } from "react";
import styled from "styled-components";
import { Table, TD, TH } from "./utils";
import { SelectVersions } from "./SelectVersions";
import { useVersions, VersionStates } from "./VersionContext";
import makeTestData from "./makeTestData";
import ParameterTable from "./ParameterTable";
import useSlider from "./useSlider";
import { FFT } from "fft-api/dst";

type Result = {
  out: Complex[],
  ifft_fft: number,
  vs: Record<string, number>,
};

type Results = Record<string, Result | Error>;

const dist = (
  n: number,
  f: (i: number) => Complex,
  g: (i: number) => Complex,
  f_scale: number = 1,
  g_scale: number = 1,
): number => {
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += abs2(minus(timesScalar(f(i), f_scale), timesScalar(g(i), g_scale)));
  }
  return Math.sqrt(sum / n);
}

async function runFFTs(
  versions: VersionStates,
  testVersions: Record<string, boolean>,
  n: number,
  setResults: (results: Results) => void,
) {
  const data = makeTestData(n);
  let results: Results = {};
  for (const [name, version] of Object.entries(versions)) {
    if (version.status !== "resolved" || !testVersions[name]) continue;
    try {
      const factory = version.value;
      const fft: FFT = factory(n);
      data.map((v, i) => fft.setInput(i, v));
      fft.run(1);
      // // just to see how exceptions and diffs are handled:
      // if (name==="fft06") setComplex(out, 0, timesScalar(out[0], 1.0001));
      // if (name==="fft07") throw "fooooo";
      const out: Complex[] = new Array(n).fill(undefined);
      out.forEach((_, i) => fft.setInput(i, out[i] = fft.getOutput(i)));
      fft.run(-1);
      const ifft_fft = dist(n, i => data[i], i => fft.getOutput(i), 1, 1/n);
      results[name] = { out, ifft_fft, vs: {}};
    } catch (e) {
      results[name] = new Error(`Calculation failed: ${e}`);
    }
  }
  const versionNames = Object.keys(versions);
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
      const distance = dist(n, i => out1[i], i => out2[i], scale, scale);
      result1.vs[name2] = distance;
      result2.vs[name1] = distance;
    }
  }
  setResults(results);
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

const ResultTable: FC<{results: Results}> = ({results}) => {
  const resultEntries = Object.entries(results);
  return (
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
          <SeparatorRowField colSpan={4 + resultEntries.length}/>
        </tr>
      </thead>
      <tbody>
        {resultEntries.map(([name, result]) => (
          <Fragment key={name}>
            <tr>
              <TH left>{name}</TH>
              {result instanceof Error ? (
                <TestField colSpan={3 + resultEntries.length} error>
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
  );
};

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

const Tests: FC = () => {
  const versions = useVersions();
  const [testVersions, setTestVersions] = useState<Record<string, boolean>>({});
  const [nLabel, nSlider, n] = useSlider({
    id: "nSlider_Test", label: "Data size:",
    min: 0, max: 16,
    init: 11, transform: x => 1 << x,
  });
  const [results, setResults] = useState<Results>({});
  return (
    <>
      <p>Select the versions to test:</p>
      <SelectVersions selected={testVersions} setSelected={setTestVersions}/>
      <p>Choose parameter:</p>
      <ParameterTable>
        <tr>
          <td>{nLabel}</td>
          <td style={{padding: "0 1em"}}>{nSlider}</td>
          <td>{n}</td>
        </tr>
      </ParameterTable>
      <p>
        Execute: {}
        <button
          onClick={() => runFFTs(versions, testVersions, n, setResults)}
          disabled={!Object.values(testVersions).some(value => value)}
        >
          Run Tests
        </button>
      </p>
      {Object.keys(results).length > 0 && (
        <>
          <ResultTable {...{results}}/>
          <Legend/>
        </>
      )}
    </>
  );
};

export default Tests;