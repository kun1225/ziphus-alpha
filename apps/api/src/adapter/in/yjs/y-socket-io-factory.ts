import type { Server } from "socket.io";
import type { Document } from "@repo/y-socket.io/dist/server";
import { YSocketIO } from "@repo/y-socket.io/dist/server";
import { MongodbPersistence } from "y-mongodb-provider";
import * as Y from "yjs";

function YSocketIOFactory(io: Server) {
  const ySocketIo = new YSocketIO(io);

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

    const persistedStateVector = Y.encodeStateVector(persistedYDoc);
    const diff = Y.encodeStateAsUpdate(persistedYDoc, persistedStateVector);
    if (
      diff.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        0
      ) > 0
    )
      mdb.storeUpdate(doc.name, diff);

    Y.applyUpdate(doc, Y.encodeStateAsUpdate(persistedYDoc));

    doc.on("update", async (update) => {
      mdb.storeUpdate(doc.name, update);
    });

    persistedYDoc.destroy();
  });

  ySocketIo.on("all-document-connections-closed", async (doc: Document) => {
    await mdb.flushDocument(doc.name);
  });

  ySocketIo.initialize();
  return ySocketIo;
}

export default YSocketIOFactory;
