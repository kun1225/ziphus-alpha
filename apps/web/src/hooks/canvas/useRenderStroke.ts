import Stroke from "@/models/stroke";
import { useEffect, useRef } from "react";
import { drawLine } from "@/utils/canvas/draw-line";
import resizeCanvas from "@/utils/canvas/resize-canvas";

interface UseRenderStrokeProps {
  originalRenderStrokesRef: React.MutableRefObject<Stroke[]>;
  remoteRenderStrokesRef: React.MutableRefObject<Stroke[]>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D | null;
}
function useRenderStroke({
  originalRenderStrokesRef,
  remoteRenderStrokesRef,
  canvasRef,
  ctx,
}: UseRenderStrokeProps) {
  const lastStrokesLengthRef = useRef<number>(0);
  const lastStrokeLinesLengthRef = useRef<number>(0);

  useEffect(() => {
    let animationFrameId: number;
    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      const currentStrokesLength =
        originalRenderStrokesRef.current.length +
        remoteRenderStrokesRef.current.length;
      const currentStrokeLinesLength =
        (originalRenderStrokesRef.current[
          originalRenderStrokesRef.current.length - 1
        ]?.lines.length ?? 0) +
        (remoteRenderStrokesRef.current[
          remoteRenderStrokesRef.current.length - 1
        ]?.lines.length ?? 0);

      if (
        lastStrokesLengthRef.current === currentStrokesLength &&
        lastStrokeLinesLengthRef.current === currentStrokeLinesLength
      ) {
        return;
      }

      if (!ctx || !canvasRef.current) return;

      resizeCanvas(canvasRef.current);
      originalRenderStrokesRef.current?.forEach((stroke) => {
        stroke.lines?.forEach((line) => {
          drawLine(ctx, line);
        });
      });
      remoteRenderStrokesRef.current?.forEach((stroke) => {
        stroke.lines?.forEach((line) => {
          drawLine(ctx, line);
        });
      });

      lastStrokesLengthRef.current = currentStrokesLength;
      lastStrokeLinesLengthRef.current = currentStrokeLinesLength;
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [canvasRef.current, ctx]);
}

export default useRenderStroke;
