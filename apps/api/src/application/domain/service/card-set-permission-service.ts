import { type CardSetPermissionUseCaseConstructor } from "@/application/port/in/card-set-permission-use-case";

const cardGetWithAllUseCaseConstructor: CardSetPermissionUseCaseConstructor =
  (loadCard, saveCard) =>
  async ({ cardId, permission }) => {
    throw new Error("Not implemented");
  };

export default cardGetWithAllUseCaseConstructor;
