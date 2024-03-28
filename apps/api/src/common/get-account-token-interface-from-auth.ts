import type AccountTokenInterface from "@/application/port/in/account-token-interface";
import { decodeToken } from "./jwt-token";

function getAccountTokenInterfaceFromAuth({
  authorization,
}: {
  authorization: string;
}): AccountTokenInterface | null {
  try {
    const accountTokenInterface =
      decodeToken<AccountTokenInterface>(authorization);
    return accountTokenInterface;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default getAccountTokenInterfaceFromAuth;
