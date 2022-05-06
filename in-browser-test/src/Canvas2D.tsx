import { FC, useEffect, useRef, useState } from "react";
import { useAnimationFrames } from "./animationFrames";

type AnimateCanvas2D = (
  time: number,
  canvasContext: CanvasRenderingContext2D
) => void;

const Canvas2D: FC<{width: number, height: number, animate: AnimateCanvas2D}> = props => {
  const time = useAnimationFrames();
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = canvasRef.current;
  if (canvasContext) {
    canvasContext.save();
    try {
      props.animate(time, canvasContext);
    } finally {
      canvasContext.restore();
    }
  }
  useEffect(() => {
    setCanvasContext(canvas?.getContext("2d") ?? null);
  }, [canvas]);
  return <canvas ref={canvasRef} style={{border: "1px solid green"}} width={props.width} height={props.height}/>;
}

export default Canvas2D;