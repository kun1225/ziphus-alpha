import { useState, useRef } from 'react';
import Line from '@/models/line';
import Stroke from '@/models/stroke';
import * as Y from 'yjs';
import { v4 } from 'uuid';
import { PencilInfo } from '@/components/card/card-editor-sketch-panel';
import { SketchCanvasProvider } from '@repo/sketch-canvas';

interface UseActionProps {
  remoteYArray: Y.Array<any>;
  originalStrokes: Stroke[];
  setOriginalStrokes: React.Dispatch<React.SetStateAction<Stroke[]>>;
  pencilInfo: PencilInfo;
  sketchCanvasProvider: SketchCanvasProvider;
}
const useDrawAction = ({
  remoteYArray,
  originalStrokes,
  setOriginalStrokes,
  pencilInfo,
  sketchCanvasProvider,
}: UseActionProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const currentYStrokeRef = useRef<Y.Map<any> | null>(null);

  // 新增筆跡
  const handleStartDraw = (x: number, y: number) => {
    // 創建 Y Map 筆跡
    const strokeId = v4();
    const newStroke = new Stroke(strokeId, [
      new Line(
        strokeId,
        pencilInfo.pencilColor,
        pencilInfo.pencilSize,
        x,
        y,
        x,
        y,
      ),
    ]);
    currentYStrokeRef.current = new Y.Map();
    currentYStrokeRef.current.set('id', newStroke.id);
    currentYStrokeRef.current.set('lines', newStroke.lines);

    // 將筆跡送入遠端
    remoteYArray.push([currentYStrokeRef.current]);
    // 將筆跡加入本地
    setOriginalStrokes([...originalStrokes, newStroke]);
    setIsDrawing(true);
  };

  // 在該筆跡中新增路徑
  const handleMoveDraw = (x: number, y: number) => {
    if (!isDrawing) return;

    // 取得當前筆跡
    const currentStroke = originalStrokes[originalStrokes.length - 1]!;
    const lastLine = currentStroke.lines[currentStroke.lines.length - 1];

    // 創建路徑
    const newLine = new Line(
      currentStroke.id,
      pencilInfo.pencilColor,
      pencilInfo.pencilSize,
      lastLine ? lastLine.endX : x,
      lastLine ? lastLine.endY : y,
      x,
      y,
    );

    const newStroke = new Stroke(currentStroke.id, [
      ...currentStroke.lines,
      newLine,
    ]);

    // 加入遠端路徑
    // 暫時不同步
    // const currentTime = Date.now();
    // if (currentTime - lastSyncMoveYArrayTimeRef.current > MIN_SYNC_TIME) {
    //   currentYStrokeRef.current?.set('lines', newStroke.lines);
    //   lastSyncMoveYArrayTimeRef.current = currentTime;
    // }
    // 加入本地路徑
    setOriginalStrokes(
      originalStrokes.map((stroke) =>
        stroke.id === currentStroke.id ? newStroke : stroke,
      ),
    );
  };

  // 結束筆跡
  const handleEndDraw = () => {
    const currentStroke = originalStrokes[originalStrokes.length - 1]!;
    currentYStrokeRef.current?.set('lines', currentStroke.lines);
    setIsDrawing(false);
  };

  return { handleStartDraw, handleMoveDraw, handleEndDraw };
};

export default useDrawAction;
