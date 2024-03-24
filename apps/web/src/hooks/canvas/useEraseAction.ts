import Line from "@/models/line";
import Stroke from "@/models/stroke";
import * as Y from "yjs";
import { EraserInfo } from "@/components/card/card-editor";
import { useRef } from "react";

interface Dot {
  x: number;
  y: number;
  size: number;
}

function isCircleTouchingWideLine(circle: Dot, line: Line): boolean {
  const lineLength = Math.sqrt(
    (line.endX - line.startX) ** 2 + (line.endY - line.startY) ** 2,
  );
  const normalized = {
    x: (line.endX - line.startX) / lineLength,
    y: (line.endY - line.startY) / lineLength,
  };
  const circleToLineStart = {
    x: circle.x - line.startX,
    y: circle.y - line.startY,
  };
  const projectionLength =
    circleToLineStart.x * normalized.x + circleToLineStart.y * normalized.y;

  let closestPoint: {
    x: number;
    y: number;
  };
  if (projectionLength < 0) {
    closestPoint = {
      x: line.startX,
      y: line.startY,
    };
  } else if (projectionLength > lineLength) {
    closestPoint = {
      x: line.endX,
      y: line.endY,
    };
  } else {
    closestPoint = {
      x: line.startX + projectionLength * normalized.x,
      y: line.startY + projectionLength * normalized.y,
    };
  }

  const distanceToLine = Math.sqrt(
    (circle.x - closestPoint.x) ** 2 + (circle.y - closestPoint.y) ** 2,
  );
  return distanceToLine <= line.width / 2 + circle.size / 2;
}

interface UseActionProps {
  remoteYArray: Y.Array<any>;
  originalStrokesRef: React.MutableRefObject<Stroke[]>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  eraserInfo: EraserInfo;
}
const useEraseAction = ({
  remoteYArray,
  originalStrokesRef,
  canvasRef,
  eraserInfo,
}: UseActionProps) => {
  const isErasing = useRef(false);

  const handleStartErase = (x: number, y: number) => {
    isErasing.current = true;
    handleMoveErase(x, y);
  };
  // 尋找在接觸點附近的筆跡
  const handleMoveErase = (x: number, y: number) => {
    if (!isErasing.current || !canvasRef.current) return;
    const size = eraserInfo.eraserSize;
    const needDeleteStrokeIdList: string[] = [];

    for (let i = 0; i < remoteYArray.length; i++) {
      const lines = remoteYArray.get(i).get("lines");
      const isTouching = lines.some((line: any) =>
        isCircleTouchingWideLine({ x, y, size }, line),
      );

      if (isTouching) {
        needDeleteStrokeIdList.push(remoteYArray.get(i).get("id"));
        remoteYArray.delete(i);
        i--;
      }
    }

    originalStrokesRef.current = originalStrokesRef.current.filter(
      (stroke) => !needDeleteStrokeIdList.includes(stroke.id),
    );
  };

  const handleEndErase = () => {
    isErasing.current = false;
  };

  return {
    handleMoveErase,
    handleStartErase,
    handleEndErase,
  };
};

export default useEraseAction;
