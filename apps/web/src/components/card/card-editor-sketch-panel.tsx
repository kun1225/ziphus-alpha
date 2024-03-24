"use client";
import useDrawAction from "@/hooks/canvas/useDrawAction";
import useResizeListener from "@/hooks/canvas/useResizeListener";
import { useRef, useEffect, useState } from "react";
import * as Y from "yjs";
import Stroke from "@/models/stroke";
import useRemoteStrokeSync from "@/hooks/canvas/useRemoteStrokeSync";
import useRenderStroke from "@/hooks/canvas/useRenderStroke";

interface CardEditorDrawingPanelProps {
  isSketching: boolean;
  cardId: string;
  accountName: string;
  doc: Y.Doc;
}

function CardEditorSketchPanel({
  isSketching,
  cardId,
  accountName,
  doc,
}: CardEditorDrawingPanelProps) {
  const [yStrokes] = useState(doc.getArray("card-drawing"));
  const originalRenderStrokesRef = useRef<Stroke[]>([]);
  const remoteRenderStrokesRef = useRemoteStrokeSync({
    remoteYArray: yStrokes,
    originalStrokesRef: originalRenderStrokesRef,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = canvasRef.current?.getContext("2d") || null;

  const { handleStartDraw, handleMoveDraw, handleEndDraw } = useDrawAction({
    remoteYArray: yStrokes,
    originalStrokesRef: originalRenderStrokesRef,
    canvasRef,
  });
  useResizeListener(canvasRef);

  useRenderStroke({
    originalRenderStrokesRef,
    remoteRenderStrokesRef,
    canvasRef,
    ctx,
  });

  return (
    <>
      <button
        className="absolute right-2 top-2 z-20 h-8 w-20 rounded-md bg-white/10 text-white"
        onClick={() => {
          yStrokes.delete(0, yStrokes.length);
          originalRenderStrokesRef.current = [];
        }}
      >
        Clear
      </button>
      <canvas
        id="sketch"
        className="absolute left-0 top-0 z-10 h-full w-full"
        style={{ pointerEvents: isSketching ? "auto" : "none" }}
        ref={canvasRef}
        onMouseDown={(event) => {
          const rect = canvasRef.current?.getBoundingClientRect();
          if (!rect) return;
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          handleStartDraw(x, y);
        }}
        onMouseMove={(event) => {
          const rect = canvasRef.current?.getBoundingClientRect();
          if (!rect) return;
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          handleMoveDraw(x, y);
        }}
        onMouseUp={handleEndDraw}
        onTouchStart={(event) => {
          const rect = canvasRef.current?.getBoundingClientRect();
          if (!rect || !event.touches[0]) return;
          const x = event.touches[0].clientX - rect.left;
          const y = event.touches[0].clientY - rect.top;
          handleStartDraw(x, y);
        }}
        onTouchMove={(event) => {
          const rect = canvasRef.current?.getBoundingClientRect();
          if (!rect || !event.touches[0]) return;
          const x = event.touches[0].clientX - rect.left;
          const y = event.touches[0].clientY - rect.top;
          handleMoveDraw(x, y);
        }}
        onTouchEnd={handleEndDraw}
      ></canvas>
    </>
  );
}

export default CardEditorSketchPanel;
