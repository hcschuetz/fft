import { FC, MutableRefObject, useEffect, useRef } from "react";
import styled from "styled-components";
import { versions } from "./versions";

const versionNames = Object.keys(versions);

export const SelectVersions: FC<{
  selected: Record<string, boolean>,
  setSelected: (v: Record<string, boolean>) => void,
}> = ({selected, setSelected}) => {
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
  }, [selected]);
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
      <div style={{display: "flex", flexFlow: "row wrap"}}>
        {versionNames.map(name => (
          <label key={name} style={{flexBasis: "4em", whiteSpace: "nowrap"}}>
            <input type="checkbox"
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


export const Table = styled.table`
  border-collapse: collapse;
`;

export const TDInput = styled.td`
  padding: 0 1ex;
`;

export const TDOutput = styled.td`
  width: 3em;
  text-align: right;
`;

export const TD = styled.td`
  border: 1px solid black;
  padding: 3px;
  vertical-align: top;
`;

export const TH = styled.th`
  border: 1px solid black;
  padding: 3px;
  vertical-align: top;
`;
