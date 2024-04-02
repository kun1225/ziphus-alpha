import { useEffect, useState } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "@repo/y-socket.io";
import { getCookie } from "cookies-next";
import useSocket from "@/hooks/useSocket";

function useYJSProvide(roomName: string) {
  const { socket } = useSocket();

  const [status, setStatus] = useState<string>("disconnected");
  const [doc] = useState(new Y.Doc());
  const [provider] = useState(
    new SocketIOProvider(socket, roomName, doc, {
      auth: {
        authorization: getCookie("authorization"),
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
