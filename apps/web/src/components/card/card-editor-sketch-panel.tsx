"use client";
import { useRef, useEffect, useState } from "react";

interface CardEditorDrawingPanelProps {
  isSketching: boolean;
  cardId: string;
  accountName: string;
}

function CardEditorSketchPanel({
  isSketching,
  cardId,
  accountName,
}: CardEditorDrawingPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setctx] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        setctx(ctx);
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
      }
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas && ctx) {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [ctx]);

  const getClientCoordinates = (
    nativeEvent: React.MouseEvent | React.TouchEvent,
  ) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    let x = 0;
    let y = 0;
    if ("clientX" in nativeEvent) {
      x = nativeEvent.clientX;
      y = nativeEvent.clientY;
    } else {
      const touch = nativeEvent.touches[0];
      x = touch?.clientX || 0;
      y = touch?.clientY || 0;
    }
    x -= rect.left;
    y -= rect.top;
    return { x, y };
  };

  const startDrawing = (nativeEvent: React.MouseEvent | React.TouchEvent) => {
    const { x, y } = getClientCoordinates(nativeEvent);
    setIsDrawing(true);
    setLastPosition({ x: x || 0, y: y || 0 });
  };

  const endDrawing = () => {
    setIsDrawing(false);
    setLastPosition(null);
  };

  const draw = (nativeEvent: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !ctx) return;

    const { x, y } = getClientCoordinates(nativeEvent);
    if (lastPosition) {
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(lastPosition.x, lastPosition.y);
      ctx.lineTo(x || 0, y || 0);
      ctx.stroke();
      setLastPosition({ x: x || 0, y: y || 0 });
    }
  };

  return (
    <canvas
      id="sketch"
      className="absolute left-0 top-0 z-10 h-full w-full bg-white/0"
      style={{ pointerEvents: isSketching ? "auto" : "none" }}
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseUp={endDrawing}
      onMouseMove={draw}
      onTouchStart={(e) => {
        e.preventDefault();
        startDrawing(e);
      }}
      onTouchEnd={endDrawing}
      onTouchMove={(e) => {
        e.preventDefault();
        draw(e);
      }}
    ></canvas>
  );
}

export default CardEditorSketchPanel;
