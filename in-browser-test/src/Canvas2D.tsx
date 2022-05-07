import { CanvasHTMLAttributes, DetailedHTMLProps, FC, useEffect, useRef, useState } from "react";
import { useAnimationFrames } from "./animationFrames";

type AnimateCanvas2D = (
  time: number,
  canvasContext: CanvasRenderingContext2D
) => void;

type CanvasProps =
  DetailedHTMLProps<CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>;
type Canvas2DProps = CanvasProps & {animate: AnimateCanvas2D};

const Canvas2D: FC<Canvas2DProps> = ({animate, ...canvasProps}) => {
  const time = useAnimationFrames();
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = canvasRef.current;
  if (canvasContext) {
    canvasContext.save();
    try {
      animate(time, canvasContext);
    } finally {
      canvasContext.restore();
    }
  }
  useEffect(() => {
    setCanvasContext(canvas?.getContext("2d") ?? null);
  }, [canvas]);
  return <canvas ref={canvasRef} {...canvasProps}/>;
}

export default Canvas2D;