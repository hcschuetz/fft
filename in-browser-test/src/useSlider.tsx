import { ReactNode, useState } from "react";
import styled from "styled-components";

export const TDInput = styled.td`
  padding: 0 1ex;
`;

export const TDOutput = styled.td`
  width: 3em;
  text-align: right;
`;

function useSlider<T,>(props: {
  id: string, label: ReactNode,
  min: number, max: number, step?: number
  init: number, transform: (x: number) => T,
}): [T, ReactNode] {
  const [x, setX] = useState(props.init);
  const transformed = props.transform(x);
  return [transformed, (
    <tr>
      <td>
        <label htmlFor={props.id}>{props.label}</label>
      </td>
      <TDInput>
        <input id={props.id} type="range"
          min={props.min} max={props.max}
          value={x}
          onChange={event => setX(Number(event.target.value))}
        />
      </TDInput>
      <TDOutput>{transformed}</TDOutput>
    </tr>

  )];
}

export default useSlider;