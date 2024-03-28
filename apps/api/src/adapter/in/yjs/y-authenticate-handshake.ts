import type { CardAccessEditValidatorUseCase } from "@/application/port/in/card-access-edit-validator-use-case";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";

const YAuthenticateHandshakeConstructor =
  (cardAccessEditValidatorUseCase: CardAccessEditValidatorUseCase) =>
  async (handshake: Record<string, any>) => {
    return true;
    const { authorization, cardId } = handshake.auth;
    const accountToken = getAccountTokenInterfaceFromAuth({ authorization });
    const result = await cardAccessEditValidatorUseCase({
      accountId: accountToken?.accountId,
      cardId,
    });
    return result.available;
  };

export default YAuthenticateHandshakeConstructor;
``;
