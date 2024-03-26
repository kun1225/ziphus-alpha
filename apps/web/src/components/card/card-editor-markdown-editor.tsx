"use client";
import "@blocknote/core/fonts/inter.css";
import {
  BlockNoteView,
  darkDefaultTheme,
  useCreateBlockNote,
} from "@blocknote/react";
import "@blocknote/react/style.css";
import useUpdateCardContent from "@/hooks/card/useUpdateCardContent";
import { SocketIOProvider } from "y-socket.io";
import * as Y from "yjs";

interface CardEditorMarkdownEditorProps {
  cardId: string;
  accountName: string;
  provider: SocketIOProvider;
  doc: Y.Doc;
}
function CardEditorMarkdownEditor({
  cardId,
  accountName,
  provider,
  doc,
}: CardEditorMarkdownEditorProps) {
  const tryUpdateCardContent = useUpdateCardContent(cardId);

  const editor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment(`card-content-${cardId}`),
      user: {
        name: accountName,
        color: "#0066ff",
      },
    },
  });

  const onChange = async () => {
    const html = await editor.blocksToHTMLLossy(editor.document);
    tryUpdateCardContent(html);
  };

  return (
    <div className=" text-white">
      {!!doc && (
        <BlockNoteView
          theme={darkDefaultTheme}
          editor={editor}
          onChange={onChange}
        />
      )}
    </div>
  );
}

export default CardEditorMarkdownEditor;
