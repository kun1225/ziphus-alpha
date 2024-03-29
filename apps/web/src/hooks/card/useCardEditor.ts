import useQueryCardById from '@/hooks/card/useQueryCardById';
import { useEffect, useState } from 'react';

export type EditMode = 'text' | 'sketch';
export type SketchMode = 'pencil' | 'eraser';
export interface PencilInfo {
  pencilColor: string;
  pencilSize: number;
}
export interface EraserInfo {
  eraserSize: number;
}

const useCardEditor = (cardId: string) => {
  const { card: initialCard, isLoading, error } = useQueryCardById(cardId);
  const [card, setCard] = useState(initialCard);
  useEffect(() => {
    setCard(initialCard);
  }, [initialCard]);
  const [editMode, setEditMode] = useState<EditMode>('text');
  const [sketchMode, setSketchMode] = useState<SketchMode>('pencil');
  const [pencilInfo, setPencilInfo] = useState<PencilInfo>({
    pencilColor: 'black',
    pencilSize: 2,
  });
  const [eraserInfo, setEraserInfo] = useState<EraserInfo>({
    eraserSize: 10,
  });

  return {
    card,
    setCard,
    isLoading,
    error,
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

export default useCardEditor;