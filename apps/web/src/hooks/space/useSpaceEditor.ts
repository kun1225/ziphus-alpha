import { useEffect, useState } from 'react';
import { EditMode, EraserInfo, PencilInfo, SketchMode } from '@/components/card/card-editor-sketch-panel';
import { SpaceGetByIdResponseDTO } from '@repo/shared-types';

const useSpaceEditor = (initialSpace: SpaceGetByIdResponseDTO['space']) => {
  const [space, setSpace] = useState<SpaceGetByIdResponseDTO['space'] | null>(
    initialSpace,
  );
  useEffect(() => {
    setSpace(initialSpace);
  }, [initialSpace]);


  const [editMode, setEditMode] = useState<EditMode>('text');
  const [sketchMode, setSketchMode] = useState<SketchMode>('pencil');
  const [pencilInfo, setPencilInfo] = useState<PencilInfo>({
    pencilColor: 'white',
    pencilSize: 8,
  });
  const [eraserInfo, setEraserInfo] = useState<EraserInfo>({
    eraserSize: 16,
  });

  return {
    space,
    setSpace,
    editMode,
    setEditMode,
    sketchMode,
    setSketchMode,
    pencilInfo,
    setPencilInfo,
    eraserInfo,
    setEraserInfo,
  };
};

export default useSpaceEditor;