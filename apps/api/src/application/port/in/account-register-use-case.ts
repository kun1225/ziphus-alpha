import { type LoadAccountPort } from "../out/load-account-port";
import { type SaveAccountPort } from "../out/save-account-port";

export interface AccountRegisterUseCaseConstructor {
  (
    loadAccount: LoadAccountPort,
    saveAccount: SaveAccountPort
  ): AccountRegisterUseCase;
}

/**
 * @returns {Promise<string>} - Login token
 */
export interface AccountRegisterUseCase {
  (props: {
    googleId: string | null;
    email: string;
    name: string;
    password: string;
  }): Promise<string>;
}
