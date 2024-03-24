// hooks/useResizeListener.ts
import resizeCanvas from "@/utils/resize-canvas";
import { useEffect } from "react";

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
