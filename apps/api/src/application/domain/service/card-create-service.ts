import { randomUUID } from "node:crypto";
import { type CardCreateUseCaseConstructor } from "@/application/port/in/card-create-use-case";
import Card, { CardPermission } from "../model/card";

const DEFAULT_CARD_PERMISSION = CardPermission.Private;
const DEFAULT_CARD_WIDTH = 1280;
const DEFAULT_CARD_HEIGHT = 1280;

const cardCreateUseCaseConstructor: CardCreateUseCaseConstructor =
  (loadAccount, saveCard) =>
  async ({ accountId }) => {
    const existingAccount = await loadAccount({ id: accountId });
    if (!existingAccount) {
      throw new Error("Unauthorized or Account not found");
    }

    const newCard = new Card(
      randomUUID(),
      accountId,
      DEFAULT_CARD_PERMISSION,
      "",
      "",
      DEFAULT_CARD_WIDTH,
      DEFAULT_CARD_HEIGHT,
      [],
      [],
      new Date().toISOString(),
      new Date().toISOString(),
      null
    );

    await saveCard(newCard, true);

    return newCard;
  };

export default cardCreateUseCaseConstructor;
