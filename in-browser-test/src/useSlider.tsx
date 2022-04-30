import { ReactNode, useState } from "react";

function useSlider<T,>(props: {
  id: string, label: ReactNode,
  min: number, max: number, step?: number
  init: number, transform: (x: number) => T,
}): [ReactNode, ReactNode, T] {
  const [x, setX] = useState(props.init);
  const transformed = props.transform(x);
  return [
    <label htmlFor={props.id}>{props.label}</label>,
    <input id={props.id} type="range"
      min={props.min} max={props.max} step={props.step}
      value={x}
      onChange={event => setX(Number(event.target.value))}
    />,
    transformed
  ];
}

export function useBooleanSlider(props: {
  id: string, label: ReactNode,
  falseLabel: ReactNode, trueLabel: ReactNode,
  init: boolean,
}): [ReactNode, ReactNode, boolean] {
  const [x, setX] = useState(props.init);
  const dirLabel = (value: boolean, text: ReactNode) => (
    <span
      style={{cursor: "default", verticalAlign: "top"}}
      onClick={() => setX(value)}
    >
      {text}
      </span>
  );
  return [
    <label htmlFor={props.id}>{props.label}</label>,
    <>
      {dirLabel(false, props.falseLabel)}
      <input id={props.id} type="range"
        min={0} max={1}
        value={Number(x)}
        onChange={event => setX(event.target.value !== "0")}
        style={{margin: "0 1em", width: "2.5em"}}
      />
      {dirLabel(true, props.trueLabel)}
    </>,
    x
  ]
}

export default useSlider;