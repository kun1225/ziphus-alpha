import { useState, useRef } from "react";
import Line from "@/models/line";
import Stroke from "@/models/stroke";
import * as Y from "yjs";
import { v4 } from "uuid";

const MIN_SYNC_TIME = 500;

interface UseActionProps {
  remoteYArray: Y.Array<any>;
  originalStrokesRef: React.MutableRefObject<Stroke[]>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}
const useDrawAction = ({
  remoteYArray,
  originalStrokesRef,
  canvasRef,
}: UseActionProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const lastSyncMoveYArrayTimeRef = useRef<number>(0);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const currentYStrokeRef = useRef<Y.Map<any> | null>(null);

  // 新增筆跡
  const handleStartDraw = (x: number, y: number) => {
    // 創建 Y Map 筆跡
    const strokeId = v4();
    currentStrokeRef.current = new Stroke(strokeId, [
      new Line(strokeId, "#fff", 2, x, y, x, y),
    ]);
    currentYStrokeRef.current = new Y.Map();
    currentYStrokeRef.current.set("id", currentStrokeRef.current.id);
    currentYStrokeRef.current.set("lines", currentStrokeRef.current.lines);

    // 將筆跡送入遠端
    remoteYArray.push([currentYStrokeRef.current]);
    // 將筆跡加入本地
    originalStrokesRef.current.push({ ...currentStrokeRef.current });
    setIsDrawing(true);
  };

  // 在該筆跡中新增路徑
  const handleMoveDraw = (x: number, y: number) => {
    if (!isDrawing || !currentStrokeRef.current || !canvasRef.current) return;

    //　創建路徑
    const color = "#fff";
    const width = 2;
    const lastLine =
      currentStrokeRef.current.lines[currentStrokeRef.current.lines.length - 1];
    const startX = lastLine ? lastLine.endX : x;
    const startY = lastLine ? lastLine.endY : y;

    const newLine = new Line(
      currentStrokeRef.current.id,
      color,
      width,
      startX,
      startY,
      x,
      y,
    );

    currentStrokeRef.current.lines.push(newLine);

    // 加入遠端路徑
    const currentTime = Date.now();
    if (currentTime - lastSyncMoveYArrayTimeRef.current > MIN_SYNC_TIME) {
      currentYStrokeRef.current?.set("lines", currentStrokeRef.current.lines);
      lastSyncMoveYArrayTimeRef.current = currentTime;
    }
    // 加入本地路徑
    const currentOriginalStroke =
      originalStrokesRef.current[originalStrokesRef.current.length - 1];
    if (!currentOriginalStroke) return;
    currentOriginalStroke.lines.push(newLine);
  };

  // 結束筆跡
  const handleEndDraw = () => {
    currentYStrokeRef.current?.set("lines", currentStrokeRef?.current?.lines);
    if (currentStrokeRef.current) {
      currentStrokeRef.current = null;
    }
    setIsDrawing(false);
  };

  return { handleStartDraw, handleMoveDraw, handleEndDraw };
};

export default useDrawAction;
