import Card from "@/application/domain/model/card";
import { type LoadCardListPort } from "../out/load-card-list-port";

export interface CardGetWithAllUseCaseConstructor {
  (loadCardList: LoadCardListPort): CardGetWithAllUseCase;
}

export interface CardGetWithAllUseCase {
  (props: { accountId: string }): Promise<Card[]>;
}
