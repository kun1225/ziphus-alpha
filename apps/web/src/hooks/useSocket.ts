"use client";
import { getCookie } from "cookies-next";
import { io, Socket } from "socket.io-client";

// eslint-disable-next-line turbo/no-undeclared-env-vars
const baseURL = process.env.NEXT_PUBLIC_API_ENDPOINT;

let socket: Socket | null = null;

interface UseSocket {
  socketEmitWithAuth: (event: string, data: any) => void;
  socket: Socket;
}
function useSocket(): UseSocket {
  // 伺服器端不需要建立 socket
  if (typeof window === "undefined") {
    throw new Error("useSocket is not supported on the server side");
  }

  if (!socket) {
    if (!baseURL) {
      throw new Error("NEXT_PUBLIC_API_ENDPOINT is not defined");
    }

    socket = io(baseURL, {
      auth: {
        authorization: getCookie("authorization"),
      },
    });
  }

  const socketEmitWithAuth = (event: string, data: any) => {
    socket?.emit(event, {
      ...data,
      authorization: getCookie("authorization"),
    });
  };

  return { socketEmitWithAuth, socket };
}

export default useSocket;
