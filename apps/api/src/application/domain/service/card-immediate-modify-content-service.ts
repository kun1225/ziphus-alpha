import { type CardImmediateModifyContentUseCaseConstructor } from "@/application/port/in/card-immediate-modify-content-use-case";

const cardGetWithAllUseCaseConstructor: CardImmediateModifyContentUseCaseConstructor =
  (loadCard, saveCard, emitSocket) => async (contentModifyEvent) => {
    throw new Error("Not implemented");
  };

export default cardGetWithAllUseCaseConstructor;
