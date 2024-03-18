import { CardPermissionDTO } from "@repo/shared-types";
import type { CardGetByIdUseCase } from "@/application/port/in/card-get-by-id-use-case";
import type YJSControllerInterface from "./yjs-controller-interface";
import * as Y from "yjs";
import { Document } from "y-socket.io/dist/server";
import { extractCardId } from "@/common/extract-card-id";

const cardEndEditSingleCardController: YJSControllerInterface<
  CardGetByIdUseCase
> = (ySocketIO, cardGetByIdUseCase) => {
  ySocketIO.on("document-loaded", async (doc: Document) => {
    const room = doc.name;
    const cardId = extractCardId(room);

    try {
      const card = await cardGetByIdUseCase({
        accountId: "04b8b851-6423-4f44-b6b2-f660acfc4b5d",
        cardId,
      });

      const cardDto = card
        ? {
            ...card,
            permission: CardPermissionDTO[card.permission],
          }
        : null;

      Y.applyUpdate(doc, cardDto?.content ?? new Uint8Array());
    } catch (error) {
      console.error(error);
    }
  });
};

export default cardEndEditSingleCardController;
