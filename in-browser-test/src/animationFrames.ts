import { useEffect, useState } from "react";

/**
 * A "promisified" version of `requestAnimationFrame()`.
 * The callback `handleId` is called (synchronously)
 * with the id of the animation-frame request,
 * so that you can cancel the request if needed.
 */
export function animationFrame(handleId: (id: number) => void): Promise<number> {
  let callback: FrameRequestCallback;
  const promise = new Promise<number>(resolve => { callback = resolve; });
  handleId(requestAnimationFrame(callback!));
  return promise;
}

/**
 * Call this in your component to ensure re-rendering upon new animation frames.
 * @returns the time (in milliseconds) since the initial rendering of the component.
 */
export function useAnimationFrames(): number {
  const [t, setT] = useState<number>(0);
  useEffect(() => {
    let id: number;
    async function loop() {
      const t0 = performance.now();
      for (;;) {
        setT((await animationFrame(value => { id = value; }) - t0));
      }
    }
    loop();
    return () => cancelAnimationFrame(id);
  }, []);
  return t;
}
