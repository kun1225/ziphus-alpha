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
    };
  }, []);

  return (
    <div className="text-white">
      <p>State: {status}</p>
      {!(status === "connected") ? (
        <>
          <button onClick={() => provider.connect()}>Connect</button>
        </>
      ) : (
        !!doc && <BlockNoteView theme={darkDefaultTheme} editor={editor} />
      )}
    </div>
  );
}

export default CardEditorMarkdownEditor;
