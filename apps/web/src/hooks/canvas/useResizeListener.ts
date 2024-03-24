// hooks/useResizeListener.ts
import { useEffect } from "react";
import resizeCanvas from "@/utils/canvas/resize-canvas";

const useResizeListener = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        resizeCanvas(canvas);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [canvasRef]);
};

export default useResizeListener;
