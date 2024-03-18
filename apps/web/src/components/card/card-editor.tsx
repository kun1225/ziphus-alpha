"use client";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

const CardEditorMarkdownEditor = dynamic(
  () => import("@/components/card/card-editor-markdown-editor"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  },
);

function CardEditor() {
  const { id } = useParams();

  if (!id) return null;

  return (
    <div className="w-full">
      <CardEditorMarkdownEditor cardId={id as string} />
    </div>
  );
}

export default CardEditor;
