import { type LoadAccountPort } from "../out/load-account-port";
import { type LoadCardPort } from "../out/load-card-port";
import { type SaveCardPort } from "../out/save-card-port";

export interface CardCreateUseCaseConstructor {
  (
    loadAccount: LoadAccountPort,
    loadCard: LoadCardPort,
    saveCard: SaveCardPort
  ): CardCreateUseCase;
}

/**
 * @returns {Promise<string>} - Login token
 */
export interface CardCreateUseCase {
  (props: { email: string; password: string }): Promise<string>;
}
