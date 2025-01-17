import type { CardDeleteUseCaseConstructor } from "@/application/port/in/card-delete-use-case";

const cardDeleteUseCaseConstructor: CardDeleteUseCaseConstructor =
  (loadCard, deleteCard) =>
    async ({ accountId, cardId }) => {
      const card = await loadCard({
        id: cardId,
      });
      if (!card) {
        throw new Error("Card not found");
      }

      if (card.belongAccountId !== accountId) {
        throw new Error("Permission denied");
      }


      await deleteCard(card);

      return true;
    };

export default cardDeleteUseCaseConstructor;
