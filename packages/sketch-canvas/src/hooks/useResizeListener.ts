import { useEffect } from "react";
import resizeCanvas from "../utils/resize-canvas";

export const useResizeListener = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
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

