import { type AccountRegisterUseCaseConstructor } from "@/application/port/in/account-register-use-case";
import Account from "../model/account";
import { signToken } from "@/common/jwt-token";
import { randomUUID } from "crypto";
import hash from "@/common/hash";
import AccountTokenInterface from "@/application/port/in/account-token-interface";

const accountRegisterUseCaseConstructor: AccountRegisterUseCaseConstructor =
  (loadAccount, saveAccount) =>
  async ({ googleId, email, name, password }) => {
    const existingAccount = await loadAccount({ email });
    if (existingAccount) {
      throw new Error("Account already exists");
    }

    const hashedPassword = await hash(password);

    const account = new Account(
      randomUUID(),
      googleId,
      email,
      name,
      hashedPassword,
      new Date().toISOString(),
      new Date().toISOString(),
      null
    );

    await saveAccount(account);

    return signToken<AccountTokenInterface>({
      id: randomUUID(),
      accountId: account.id,
      name: account.name,
      email: account.email,
    });
  };

export default accountRegisterUseCaseConstructor;
