import { CardAccessEditValidatorUseCase } from "@/application/port/in/card-access-edit-validator-use-case";

const YAuthenticateHandshakeConstructor =
  (cardAccessEditValidatorUseCase: CardAccessEditValidatorUseCase) =>
  async (handshake: { [key: string]: any }) => {
    const { authorization, cardId } = handshake.auth;
    const accountId = authorization;
    const result = await cardAccessEditValidatorUseCase({
      accountId,
      cardId,
    });
    return result.available;
  };

export default YAuthenticateHandshakeConstructor;
