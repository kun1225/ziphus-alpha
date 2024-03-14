import { type CardSetPermissionUseCaseConstructor } from "@/application/port/in/card-set-permission-use-case";

const cardGetWithAllUseCaseConstructor: CardSetPermissionUseCaseConstructor =
  (loadCard, saveCard) =>
  async ({ accountId, cardId, permission }) => {
    const card = await loadCard({
      id: cardId,
    });
    if (!card) {
      throw new Error("Card not found");
    }

    if (card.belongAccountId !== accountId) {
      throw new Error("Card not found");
    }

    const updatedCard = {
      ...card,
      permission,
    };

    await saveCard(updatedCard);

    return true;
  };

export default cardGetWithAllUseCaseConstructor;
