import Card from "@/application/domain/model/card";
import { type LoadCardPort } from "../out/load-card-port";

export interface CardGetByIdUseCaseConstructor {
  (loadCard: LoadCardPort): CardGetByIdUseCase;
}

export interface CardGetByIdUseCase {
  (props: { cardId: string; accountId?: string }): Promise<Card | null>;
}
