import cardSetPermissionUseCaseConstructor from "@/application/domain/service/card-set-permission-service";
import { type CardSetPermissionUseCaseConstructor } from "@/application/port/in/card-set-permission-use-case";
import { LoadCardPort } from "@/application/port/out/load-card-port";
import { SaveCardPort } from "@/application/port/out/save-card-port";
import { createExampleAccount, createExampleCard } from "./create-example-data";
import { CardPermission } from "@/application/domain/model/card";

describe("CardSetPermissionUseCase", () => {
  let cardSetPermissionUseCase: ReturnType<CardSetPermissionUseCaseConstructor>;
  let loadCardPort: jest.Mock<ReturnType<LoadCardPort>>;
  let saveCardPort: jest.Mock<ReturnType<SaveCardPort>>;

  beforeEach(() => {
    loadCardPort = jest.fn();
    saveCardPort = jest.fn();
    cardSetPermissionUseCase = cardSetPermissionUseCaseConstructor(
      loadCardPort,
      saveCardPort
    );
  });

  it(`
    Given a existing card id and card owner account id 
    When set permission
    Then it should return true
  `, async () => {
    const exampleAccount = await createExampleAccount();
    const exampleCard = createExampleCard(exampleAccount.id);
    loadCardPort.mockResolvedValue(exampleCard);
    saveCardPort.mockResolvedValue(undefined);
    const result = await cardSetPermissionUseCase({
      accountId: exampleAccount.id,
      cardId: exampleCard.id,
      permission: CardPermission.PublicEditable,
    });
    expect(result).toEqual(true);
  });

  it(`
    Given a non-existing card id
    When set permission
    Then it should throw an error
  `, async () => {
    const exampleAccount = await createExampleAccount();
    loadCardPort.mockResolvedValue(null);
    const result = cardSetPermissionUseCase({
      accountId: exampleAccount.id,
      cardId: "non-existing-card-id",
      permission: CardPermission.PublicEditable,
    });
    await expect(result).rejects.toThrow();
  });

  it(`
    Given a existing card id but not owner account id
    When set permission
    Then it should throw an error
  `, async () => {
    const exampleAccount = await createExampleAccount();
    const exampleCard = createExampleCard("another-account-id");
    loadCardPort.mockResolvedValue(exampleCard);
    const result = cardSetPermissionUseCase({
      accountId: exampleAccount.id,
      cardId: exampleCard.id,
      permission: CardPermission.PublicEditable,
    });
    await expect(result).rejects.toThrow();
  });
});
