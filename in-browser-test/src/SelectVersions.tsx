import { FC, MutableRefObject, useEffect, useRef, useState } from "react";
import { useVersions } from "./VersionContext";

export const SelectVersions: FC<{
  selected: Record<string, boolean>,
  setSelected: (v: Record<string, boolean>) => void,
}> = ({selected, setSelected, children}) => {
  const versions = useVersions();
  const versionNames = Object.keys(versions);
  const allRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
  useEffect(() => {
    const all = allRef.current;
    if (all) {
      all.checked =
        versionNames.every(name => selected[name]);
      all.indeterminate =
        versionNames.some(name => selected[name]) &&
        versionNames.some(name => !selected[name]);
    }
  }, [versionNames, selected]);
  const [regexp, setRegexp] = useState("^(C.|.W) fft(47p|60|99|Kiss$)");
  function applyRegexp() {
    setSelected(Object.fromEntries(
      versionNames.map(name => [name, RegExp(regexp).test(name)])
    ));
  }
  let regexpOk = true;
  try {
    RegExp(regexp);
  } catch (e) {
    regexpOk = false;
  }
  return (
    <div>
      <details>
        <summary>{children}</summary>
        <div className="details-body">
          <ul>
            <li>
              The "all versions" checkbox selects/deselects all versions.
            </li>
            <li>
              You can use the regular expression
              (<a target="_blank" rel="noreferrer"
                href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Cheatsheet"
              >in JavaScript RegExp syntax</a>)
              to select versions with matching names.
              <br/>
              Note that the expression matches substrings of the version names.
              If you only want to match the entire names,
              use a regular expression starting with "^" and ending with "$".
              <br/>
              To actually select the matched versions hit enter or click the "apply" button.
              This button is only enabled when the regular expression is syntactically correct.
            </li>
            <li>
              And of course you can select/deselect individual versions.
            </li>
            <li>
              For information on the FFT implementations look
              {} <a target="_blank" rel="noreferrer"
                href="https://github.com/hcschuetz/fft/blob/main/versions.md"
              >here</a>.
            </li>
          </ul>
        </div>
      </details>
      <label style={{flexBasis: "4em", whiteSpace: "nowrap"}}>
        <input type="checkbox"
          ref={allRef}
          onChange={event => {
            const checked = event.target.checked;
            setSelected(Object.fromEntries(versionNames.map(name => [name, checked])));
          }}
        />
        all versions
      </label>
      <div>
        <label>
          Regular expression:
          <input type="text" width={30} style={{marginLeft: "1em", width: "25em"}}
            value={regexp}
            onChange={event => setRegexp(event.target.value)}
            onKeyUp={event => event.key === "Enter" && applyRegexp()}
          />
        </label>
        <button style={{marginLeft: "1em"}} onClick={applyRegexp}
          disabled={!regexpOk}
        >apply</button>
      </div>
      <div style={{display: "flex", flexFlow: "row wrap"}}>
        {Object.entries(versions).map(([name, version]) => (
          <label key={name}
            style={{
              flexBasis: "10em",
              whiteSpace: "nowrap",
              textDecoration: version.status === "rejected" ? "line-through" : "normal"
            }}
            title={version.status === "rejected" ? version.reason.toString() : undefined}
          >
            <input type="checkbox"
              disabled={version.status !== "resolved"}
              checked={Boolean(selected[name])}
              onChange={event => setSelected({
                ...selected,
                [name]: event.target.checked
              })}
            />
            {name}
          </label>
        ))}
      </div>
    </div>
  );
}

