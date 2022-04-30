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
    // Hacky table styling.  TODO Convert to grid.
    <tr>
      <td>
        <label htmlFor={props.id}>{props.label}</label>
      </td>
      <TDInput>
        <input id={props.id} type="range"
          min={props.min} max={props.max} step={props.step}
          value={x}
          onChange={event => setX(Number(event.target.value))}
        />
      </TDInput>
      <td style={{width: "20em", textAlign: "left"}}>
        <div style={{display: "inline-block", width: "3em", textAlign: "right"}}>
          {transformed}
        </div>
      </td>
    </tr>

  )];
}

export function useBooleanSlider(props: {
  id: string, label: ReactNode,
  falseLabel: ReactNode, trueLabel: ReactNode,
  init: boolean,
}): [boolean, ReactNode] {
  const [x, setX] = useState(props.init);
  const dirLabel = (value: boolean, text: ReactNode) => (
    <span
      style={{cursor: "default", verticalAlign: "top"}}
      onClick={() => setX(value)}
    >
      {text}
      </span>
  );
  return [x, (
    <tr>
    <td>
      <label htmlFor={props.id}>{props.label}</label>
    </td>
    <TDInput colSpan={2}>
      {dirLabel(false, props.falseLabel)}
      <input id={props.id} type="range"
        min={0} max={1}
        value={Number(x)}
        onChange={event => setX(event.target.value !== "0")}
        style={{margin: "0 1em", width: "2.5em"}}
      />
      {dirLabel(true, props.trueLabel)}
    </TDInput>
  </tr>
  )]
}

export default useSlider;