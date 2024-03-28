import type { Server } from "socket.io";
import { YSocketIO } from "y-socket.io/dist/server";
import type YAuthenticateHandshakeConstructor from "@/adapter/in/yjs/y-authenticate-handshake";

function YSocketIOFactory(
  io: Server,
  authenticate: ReturnType<typeof YAuthenticateHandshakeConstructor>
) {
  const ySocketIo = new YSocketIO(io, {
    levelPersistenceDir: "./yjs-data",
    authenticate,
  });
  ySocketIo.initialize();
  return ySocketIo;
}

export default YSocketIOFactory;
