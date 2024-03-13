import { type LoadAccountPort } from "../out/load-account-port";
import { type SaveAccountPort } from "../out/save-account-port";

export interface AccountLoginWithEmailUseCaseConstructor {
  (
    loadAccount: LoadAccountPort,
    saveAccount: SaveAccountPort
  ): AccountLoginWithEmailUseCase;
}

/**
 * @returns {Promise<string>} - Login token
 */
export interface AccountLoginWithEmailUseCase {
  (props: { email: string; password: string }): Promise<string>;
}
