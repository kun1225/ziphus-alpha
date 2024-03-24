import { useEffect, useState } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";
import { getCookie } from "cookies-next";

function useYJSProvide(cardId: string) {
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

  return {
    doc,
    provider,
    status,
  };
}

export default useYJSProvide;
