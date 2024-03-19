"use client";
import "@blocknote/core/fonts/inter.css";
import {
  BlockNoteView,
  darkDefaultTheme,
  useCreateBlockNote,
} from "@blocknote/react";
import "@blocknote/react/style.css";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";
import { getCookie } from "cookies-next";
import useUpdateCardContent from "@/hooks/card/useUpdateCardContent";

interface CardEditorMarkdownEditorProps {
  cardId: string;
  accountName: string;
}
function CardEditorMarkdownEditor({
  cardId,
  accountName,
}: CardEditorMarkdownEditorProps) {
  const [status, setStatus] = useState<string>("disconnected");
  const [doc] = useState(new Y.Doc());
  const [provider] = useState(
    new SocketIOProvider("ws://localhost:8080", `card-${cardId}`, doc, {
      autoConnect: true,
      auth: {
        authorization: getCookie("authorization"),
        cardId,
      },
    }),
  );
  const tryUpdateCardContent = useUpdateCardContent(cardId);

  const editor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("card-content"),
      user: {
        name: accountName,
        color: "#0066ff",
      },
    },
  });

  useEffect(() => {
    provider.on("sync", (isSync: boolean) =>
      console.log("websocket sync", isSync),
    );
    provider.on("status", ({ status: _status }: { status: string }) => {
      if (_status) setStatus(_status);
    });

    return () => {
      provider.disconnect();
      provider.destroy();
    };
  }, []);

  const onChange = async () => {
    const html = await editor.blocksToHTMLLossy(editor.document);
    tryUpdateCardContent(html);
  };

  return (
    <div className=" text-white">
      {!(status === "connected") ? (
        <>
          <button onClick={() => provider.connect()}>Connect</button>
        </>
      ) : (
        !!doc && (
          <BlockNoteView
            theme={darkDefaultTheme}
            editor={editor}
            onChange={onChange}
          />
        )
      )}
    </div>
  );
}

export default CardEditorMarkdownEditor;
