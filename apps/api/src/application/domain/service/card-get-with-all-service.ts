import { type CardGetWithAllUseCaseConstructor } from "@/application/port/in/card-get-with-all-use-case";

const cardGetWithAllUseCaseConstructor: CardGetWithAllUseCaseConstructor =
  (loadCard) =>
  async ({ accountId }) => {
    throw new Error("Not implemented");
  };

export default cardGetWithAllUseCaseConstructor;
