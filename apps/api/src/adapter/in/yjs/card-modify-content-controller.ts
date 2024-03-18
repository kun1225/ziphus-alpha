import type { CardModifyContentUseCase } from "@/application/port/in/card-modify-content-use-case";
import type IoControllerInterface from "./yjs-controller-interface";
import { Document } from "y-socket.io/dist/server";
import { extractCardId } from "@/common/extract-card-id";
import * as Y from "yjs";

const CardModifyContentController: IoControllerInterface<
  CardModifyContentUseCase
> = (ySocketIO, cardImmediateModifyContentUseCase) => {
  ySocketIO.on("document-update", (doc: Document, update: Uint8Array) => {
    const room = doc.name;
    const cardId = extractCardId(room);
    if (!cardId) return;

    const content = Y.encodeStateAsUpdate(doc);
    console.log("content", new TextDecoder().decode(content));
    console.log("content", content.length);
    cardImmediateModifyContentUseCase({
      cardId,
      content,
    });
  });
};

export default CardModifyContentController;
