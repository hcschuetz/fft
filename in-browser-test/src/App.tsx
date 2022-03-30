import { FC } from 'react';
import styled from 'styled-components';

import { Tests } from './testing';
import { Benchmark } from './benchmarking';


const DeEmphasized = styled.span`
  color: #888;
`;
const Emphasized = styled.span`
  color: #000;
  font-weight: bolder;
  background: #ddd;
  padding-left: 3px;
  padding-right: 3px;
`;

// Guess which of the browser names in the user-agent string actually represents
// the current browser and emphasize it.
const UserAgent: FC = () => {
  let userAgent = navigator.userAgent;
  for (const re of [
    // The order of regular expressions does matter here!
    // TODO Test on all kinds of browsers.
    /^(.*\s)?(OPR\/\S+)(.*)$/,
    /^(.*\s)?(Edg\/\S+)(.*)$/,
    /^(.*\s)?(Chrome\/\S+)(.*)$/,
    /^(.*\s)?(Safari\/\S+)(.*)$/,
    /^(.*\s)?(Firefox\/\S+)(.*)$/,
    /^(.*\s)?(MSIE\s+[^ ;)]*)(.*)$/,
  ]) {
    const m = re.exec(userAgent as string);
    if (m) {
      return (<DeEmphasized>{m[1]}<Emphasized>{m[2]}</Emphasized>{m[3]}</DeEmphasized>);
    }
  }
  return (<span>userAgent</span>);
};

function App() {
  return (
    <>
      <h1>Comparing FFT Implementation Variants</h1>
      <p>
        See <a href="https://github.com/hcschuetz/fft/">
          the GitHub repository
        </a> for more information.
      </p>
      <h2>Tests</h2>
      <Tests/>
      <h2>Benchmarks</h2>
      <Benchmark/>
      <h2>User Agent</h2>
      <p>
        The test and benchmark results above are from this browser:
        <br/>
        <code><UserAgent/></code>
      </p>
    </>
  );
}

export default App;
