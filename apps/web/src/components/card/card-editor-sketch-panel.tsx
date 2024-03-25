'use client';
import useDrawAction from '@/hooks/card-sketch/useDrawAction';
import { useEffect, useState } from 'react';
import * as Y from 'yjs';
import Stroke from '@/models/stroke';
import useRemoteStrokeSync from '@/hooks/card-sketch/useRemoteStrokeSync';
import { EraserInfo, PencilInfo, SketchMode } from './card-editor';
import {
  Shape,
  ShapeType,
  SketchCanvas,
  SketchCanvasProvider,
  useSketchCanvasProvider,
  Line,
} from '@repo/sketch-canvas';
import useEraseAction from '@/hooks/card-sketch/useEraseAction';


interface CardEditorDrawingPanelProps {
  isSketching: boolean;
  cardId: string;
  accountName: string;
  doc: Y.Doc;
  sketchMode: SketchMode;
  pencilInfo: PencilInfo;
  eraserInfo: EraserInfo;
  sketchCanvasProvider: SketchCanvasProvider;
}

function CardEditorSketchPanel({
  isSketching,
  cardId,
  accountName,
  doc,
  sketchMode,
  pencilInfo,
  eraserInfo,
  sketchCanvasProvider,
}: CardEditorDrawingPanelProps) {
  const [yStrokes] = useState(doc.getArray('card-drawing'));
  const [originalRenderStrokes, setOriginalRenderStrokes] = useState<Stroke[]>([]);
  const remoteRenderStrokes = useRemoteStrokeSync({
    remoteYArray: yStrokes,
    originalStrokes: originalRenderStrokes,
  });
  const provider = useSketchCanvasProvider();

  const { handleStartDraw, handleMoveDraw, handleEndDraw } = useDrawAction({
    remoteYArray: yStrokes,
    originalStrokes: originalRenderStrokes,
    setOriginalStrokes: setOriginalRenderStrokes,
    pencilInfo,
    sketchCanvasProvider,
  });

  const { eraser, handleEndErase, handleMoveErase, handleStartErase } = useEraseAction({
    remoteYArray: yStrokes,
    originalStrokes: originalRenderStrokes,
    setOriginalStrokes: setOriginalRenderStrokes,
    eraserInfo,
    sketchCanvasProvider,
  });

  useEffect(() => {
    const lines: Line[] =
      [...originalRenderStrokes, ...remoteRenderStrokes].map(stroke => stroke.lines)
        .flat()
        .map((line, index) => ({
          id: `${line.strokeId}:${index}`,
          type: ShapeType.Line,
          startX: line.startX,
          startY: line.startY,
          endX: line.endX,
          endY: line.endY,
          strokeStyle: line.color,
          lineWidth: line.width,
        } as Line));

    const renderShapes: Shape[] = [...lines, ...(
      eraser ? [eraser] : []
    )];
    provider.setShapes(renderShapes);
  }, [originalRenderStrokes, eraser]);

  return (
    <>
      <button
        className="absolute right-2 top-2 z-20 h-8 w-20 rounded-md bg-white/10 text-white"
        onClick={() => {
          yStrokes.delete(0, yStrokes.length);
          setOriginalRenderStrokes([]);
        }}
      >
        Clear
      </button>
      <SketchCanvas
        id="sketch"
        provider={provider}
        className="absolute left-0 top-0 z-10 h-full w-full"
        style={{ pointerEvents: isSketching ? 'auto' : 'none' }}
        handleStartDraw={(x, y) => {
          if (sketchMode === 'pencil') {
            handleStartDraw(x, y);
          } else {
            handleStartErase(x, y);
          }
        }}
        handleMoveDraw={(x, y) => {
          if (sketchMode === 'pencil') {
            handleMoveDraw(x, y);
          } else {
            handleMoveErase(x, y);
          }
        }}
        handleEndDraw={() => {
          if (sketchMode === 'pencil') {
            handleEndDraw();
          } else {
            handleEndErase();
          }
        }}
      />
    </>
  );
}

export default CardEditorSketchPanel;
