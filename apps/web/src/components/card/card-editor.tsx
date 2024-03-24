"use client";
import { useParams } from "next/navigation";
import useMe from "@/hooks/useMe";
import useQueryCardById from "@/hooks/card/useQueryCardById";
import { useState } from "react";
import CardEditorSketchPanel from "./card-editor-sketch-panel";
import CardEditorMarkdownEditor from "./card-editor-markdown-editor";
import useYJSProvide from "@/hooks/card/useYJSProvider";
import CardEditorHeadToolbar from "./card-editor-head-toolbar";

export type Mode = "text" | "sketch";

function CardEditor() {
  const { id } = useParams();
  const { card, isLoading, error } = useQueryCardById(id as string);
  const { account } = useMe();
  const [editMode, setEditMode] = useState<Mode>("text");
  const { doc, provider, status } = useYJSProvide(id as string);

  if (!card || !account) return null;

  return (
    <div className="flex flex-col gap-2">
      <CardEditorHeadToolbar editMode={editMode} setEditMode={setEditMode} />
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
