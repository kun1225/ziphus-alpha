import { type CardAddImageUseCaseConstructor } from "@/application/port/in/card-add-image-use-case";
import { CardPermission, Image } from "../model/card";
import { randomUUID } from "node:crypto";

const cardAddImageCaseConstructor: CardAddImageUseCaseConstructor =
  (loadCard, saveCard) =>
  async ({ data, cardId, accountId }) => {
    const card = await loadCard({
      id: cardId,
    });
    if (!card) {
      throw new Error("Card not found");
    }

    if (
      card.permission !== CardPermission.PublicEditable &&
      card.belongAccountId !== accountId
    ) {
      throw new Error("Permission denied");
    }

    const newImage = new Image(
      `${randomUUID()}-${data.key}`,
      data.url,
      data.key,
      new Date().toISOString(),
      new Date().toISOString(),
      null
    );

    // 儲存更新後的卡片
    await saveCard({
      ...card,
      images: [...card.images, newImage],
    });

    return true;
  };

export default cardAddImageCaseConstructor;