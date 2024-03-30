import Stroke from '@/models/stroke';
import * as Y from 'yjs';
import { EraserInfo } from '@/components/card/card-editor-sketch-panel';
import { useRef, useState } from 'react';
import isCircleTouchingWideLine from '@/utils/is-circle-touching-wide-line';
import { Circle, ShapeType, SketchCanvasProvider } from '@repo/sketch-canvas';

interface UseActionProps {
  remoteYArray: Y.Array<any>;
  originalStrokes: Stroke[];
  setOriginalStrokes: React.Dispatch<React.SetStateAction<Stroke[]>>;
  eraserInfo: EraserInfo;
  sketchCanvasProvider: SketchCanvasProvider;
}
const useEraseAction = ({
  remoteYArray,
  originalStrokes,
  setOriginalStrokes,
  eraserInfo,
  sketchCanvasProvider,
}: UseActionProps) => {
  const isErasing = useRef(false);
  const [eraser, setEraser] = useState<Circle | null>(null);

  const handleStartErase = (x: number, y: number) => {
    isErasing.current = true;
    handleMoveErase(x, y);
  };
  // 尋找在接觸點附近的筆跡
  const handleMoveErase = (x: number, y: number) => {
    if (!isErasing.current) return;
    const size = eraserInfo.eraserSize;
    const needDeleteStrokeIdList: string[] = [];

    for (let i = 0; i < remoteYArray.length; i++) {
      const lines = remoteYArray.get(i).get('lines');
      const isTouching = lines.some((line: any) =>
        isCircleTouchingWideLine({ x, y, size }, line),
      );

      if (isTouching) {
        needDeleteStrokeIdList.push(remoteYArray.get(i).get('id'));
        remoteYArray.delete(i);
        i--;
      }
    }

    setOriginalStrokes(
      originalStrokes.filter((stroke) => !needDeleteStrokeIdList.includes(stroke.id)),
    );

    setEraser({
      id: 'eraser',
      x,
      y,
      radius: size / 2,
      type: ShapeType.Circle,
      fillStyle: '#ffffff22',
      strokeStyle: '#ffffff88',
      lineWidth: 1,
    });
  };

  const handleEndErase = () => {
    isErasing.current = false;
    setEraser(null);
  };

  return {
    eraser,
    handleMoveErase,
    handleStartErase,
    handleEndErase,
  };
};

export default useEraseAction;
