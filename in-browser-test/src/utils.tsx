import { FC } from "react";
import styled from "styled-components";
import { versions } from "./versions";

export const SelectVersions: FC<{
  selected: Record<string, boolean>,
  setSelected: (v: Record<string, boolean>) => void,
}> = ({selected, setSelected}) => (
  <div style={{display: "flex", flexFlow: "row wrap"}}>
    {Object.keys(versions).map(name => (
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
)


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
