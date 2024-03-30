import type { Server } from "socket.io";
import type { Document } from "y-socket.io/dist/server";
import { YSocketIO } from "y-socket.io/dist/server";
import { MongodbPersistence } from "y-mongodb-provider";
import * as Y from "yjs";
import type YAuthenticateHandshakeConstructor from "@/adapter/in/yjs/y-authenticate-handshake";

function YSocketIOFactory(
  io: Server,
  authenticate: ReturnType<typeof YAuthenticateHandshakeConstructor>
) {
  const ySocketIo = new YSocketIO(io, {
    authenticate,
  });

  const connectionString = process.env.MONGODB_CONNECTION_STRING;

  if (!connectionString) {
    throw new Error("MONGODB_CONNECTION_STRING is not set");
  }

  const mdb = new MongodbPersistence(connectionString, {
    collectionName: "yjs-data",
    flushSize: 400,
    multipleCollections: true,
  });

  ySocketIo.on("document-loaded", async (doc: Document) => {
    const persistedYDoc = await mdb.getYDoc(doc.name);
    Y.applyUpdate(doc, Y.encodeStateAsUpdate(persistedYDoc));
    doc.on("update", async (update) => {
      mdb.storeUpdate(doc.name, update);
    });
  });

  ySocketIo.initialize();
  return ySocketIo;
}

export default YSocketIOFactory;
