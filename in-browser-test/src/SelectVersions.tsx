import { FC, MutableRefObject, useEffect, useRef, useState } from "react";
import { useVersions } from "./VersionContext";

export const SelectVersions: FC<{
  selected: Record<string, boolean>,
  setSelected: (v: Record<string, boolean>) => void,
}> = ({selected, setSelected}) => {
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

