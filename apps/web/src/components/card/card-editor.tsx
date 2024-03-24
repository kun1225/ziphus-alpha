"use client";
import { useParams } from "next/navigation";
import useMe from "@/hooks/useMe";
import useQueryCardById from "@/hooks/card/useQueryCardById";
import { useState } from "react";
import CardEditorSketchPanel from "./card-editor-sketch-panel";
import CardEditorMarkdownEditor from "./card-editor-markdown-editor";
import useYJSProvide from "@/hooks/card/useYJSProvider";
import CardEditorHeadToolbar from "./card-editor-head-toolbar";

export type EditMode = "text" | "sketch";
export type SketchMode = "pencil" | "eraser";
export interface PencilInfo {
  pencilColor: string;
  pencilSize: number;
}
export interface EraserInfo {
  eraserSize: number;
}

function CardEditor() {
  const { id } = useParams();
  const { card, isLoading, error } = useQueryCardById(id as string);
  const { account } = useMe();
  const [editMode, setEditMode] = useState<EditMode>("text");
  const [sketchMode, setSketchMode] = useState<SketchMode>("pencil");
  const [pencilInfo, setPencilInfo] = useState<PencilInfo>({
    pencilColor: "black",
    pencilSize: 2,
  });
  const [eraserInfo, setEraserInfo] = useState<EraserInfo>({
    eraserSize: 10,
  });
  const { doc, provider, status } = useYJSProvide(id as string);

  if (!card || !account) return null;

  return (
    <div className="flex flex-col gap-2">
      <CardEditorHeadToolbar
        editMode={editMode}
        setEditMode={setEditMode}
        sketchMode={sketchMode}
        setSketchMode={setSketchMode}
        pencilInfo={pencilInfo}
        setPencilInfo={setPencilInfo}
        eraserInfo={eraserInfo}
        setEraserInfo={setEraserInfo}
      />
      <div
        className="relative w-[1280px] overflow-hidden"
        style={{
          height: card.height,
        }}
      >
        <CardEditorSketchPanel
          isSketching={editMode === "sketch"}
          cardId={id as string}
          accountName={account.name}
          doc={doc}
          sketchMode={sketchMode}
          pencilInfo={pencilInfo}
          eraserInfo={eraserInfo}
        />
        <CardEditorMarkdownEditor
          cardId={id as string}
          accountName={account.name}
          provider={provider}
          doc={doc}
        />
      </div>
    </div>
  );
}

export default CardEditor;
