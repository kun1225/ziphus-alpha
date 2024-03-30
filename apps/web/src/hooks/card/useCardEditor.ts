import useQueryCardById from '@/hooks/card/useQueryCardById';
import { useEffect, useState } from 'react';
import { EditMode, EraserInfo, PencilInfo, SketchMode } from '@/components/card/card-editor-sketch-panel';

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