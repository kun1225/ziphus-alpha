import type { CardModifyContentUseCase } from "@/application/port/in/card-modify-content-use-case";
import type IoControllerInterface from "./yjs-controller-interface";
import { Document } from "y-socket.io/dist/server";
import { extractCardId } from "@/common/extract-card-id";

const CardModifyContentController: IoControllerInterface<
  CardModifyContentUseCase
> = (
  ySocketIO,
  cardImmediateModifyContentUseCase
) => {
    ySocketIO
      .on("document-update", (doc: Document, update: Uint8Array) => {
        const room = doc.name
        const cardId = extractCardId(room)
        if (!cardId) return
        const content = doc.getXmlFragment('card-content').toString()
        const jsont = doc.getXmlFragment('card-content').toJSON()
        cardImmediateModifyContentUseCase({
          cardId,
          content
        })
        console.log('document-update', room, content, jsont)
      });
  };

export default CardModifyContentController;
