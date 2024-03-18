import { Server } from "socket.io";
import { YSocketIO } from "y-socket.io/dist/server";


function YSocketIOFactory(io: Server) {
  const ysocketio = new YSocketIO(io, {
    levelPersistenceDir: "./yjs-data",
    authenticate(handshake) {
      console.log("authenticate", handshake.auth.authorization);
      return true;
    },
  });
  ysocketio.initialize();
  return ysocketio;
}

export default YSocketIOFactory;
