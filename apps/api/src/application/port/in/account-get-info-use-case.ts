import Account from "@/application/domain/model/account";
import { type LoadAccountPort } from "../out/load-account-port";

export interface AccountGetInfoUseCaseConstructor {
  (loadAccount: LoadAccountPort): AccountGetInfoUseCase;
}

export interface AccountGetInfoUseCase {
  (props: { accountId: string }): Promise<Account>;
}
