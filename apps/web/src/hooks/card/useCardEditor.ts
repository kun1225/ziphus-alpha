import useMe from "@/hooks/useMe";
import useQueryCardById from "@/hooks/card/useQueryCardById";
import { useState } from "react";

export type EditMode = "text" | "sketch";
export type SketchMode = "pencil" | "eraser";
export interface PencilInfo {
  pencilColor: string;
  pencilSize: number;
}
export interface EraserInfo {
  eraserSize: number;
}

const useCardEditor = (cardId: string) => {
  const { card, isLoading, error } = useQueryCardById(cardId);
  const [editMode, setEditMode] = useState<EditMode>("text");
  const [sketchMode, setSketchMode] = useState<SketchMode>("pencil");
  const [pencilInfo, setPencilInfo] = useState<PencilInfo>({
    pencilColor: "black",
    pencilSize: 2,
  });
  const [eraserInfo, setEraserInfo] = useState<EraserInfo>({
    eraserSize: 10,
  });

  return {
    card,
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