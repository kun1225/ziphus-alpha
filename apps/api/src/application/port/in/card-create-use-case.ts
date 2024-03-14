import Card from "@/application/domain/model/card";
import { type LoadAccountPort } from "../out/load-account-port";
import { type SaveCardPort } from "../out/save-card-port";

export interface CardCreateUseCaseConstructor {
  (loadAccount: LoadAccountPort, saveCard: SaveCardPort): CardCreateUseCase;
}

/**
 * @returns {Promise<string>} - Login token
 */
export interface CardCreateUseCase {
  (props: { accountId: string }): Promise<Card>;
}
