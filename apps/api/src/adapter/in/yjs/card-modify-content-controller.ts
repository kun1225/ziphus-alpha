import type { CardModifyContentUseCase } from "@/application/port/in/card-modify-content-use-case";
import type IoControllerInterface from "./yjs-controller-interface";
import { Document } from "y-socket.io/dist/server";
import { extractCardId } from "@/common/extract-card-id";
import * as Y from "yjs";

const CardModifyContentController: IoControllerInterface<
  CardModifyContentUseCase
> = (ySocketIO, cardModifyContentUseCase) => {
  ySocketIO.on("document-update", (doc: Document, update: Uint8Array) => {
    const room = doc.name;
    const cardId = extractCardId(room);
    if (!cardId) return;

    const content = doc.getXmlFragment("card-content").toString();
    cardModifyContentUseCase({
      cardId,
      content,
    });
  });
};

export default CardModifyContentController;
