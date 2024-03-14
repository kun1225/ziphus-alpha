import { type CardGetByIdUseCaseConstructor } from "@/application/port/in/card-get-by-id-use-case";
import Card, { CardPermission } from "../model/card";
import { randomUUID } from "crypto";

const cardGetByIdUseCaseConstructor: CardGetByIdUseCaseConstructor =
  (loadCard) =>
  async ({ cardId, accountId }) => {
    throw new Error("Not implemented");
  };

export default cardGetByIdUseCaseConstructor;
