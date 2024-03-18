import cardImmediateModifyContentUseCaseConstructor from "@/application/domain/service/card-modify-content-service";
import { type CardImmediateModifyContentUseCaseConstructor } from "@/application/port/in/card-modify-content-use-case";
import type { LoadCardPort } from "@/application/port/out/load-card-port";
import type { SaveCardPort } from "@/application/port/out/save-card-port";
import type { EmitSocketPort } from "@/application/port/out/emit-socket-port";
import type { ContentModifyEvent } from "@/application/port/in/content-modify-event";
import { CardPermission } from "@/application/domain/model/card";
import { createExampleAccount, createExampleCard } from "./create-example-data";

describe("CardImmediateModifyContentUseCase", () => {
  let cardImmediateModifyContentUseCase: ReturnType<CardImmediateModifyContentUseCaseConstructor>;
  let loadCardMock: jest.Mock<ReturnType<LoadCardPort>>;
  let saveCardMock: jest.Mock<ReturnType<SaveCardPort>>;
  let emitSocketMock: jest.Mock<ReturnType<EmitSocketPort>>;

  beforeEach(() => {
    loadCardMock = jest.fn();
    saveCardMock = jest.fn();
    emitSocketMock = jest.fn();
    cardImmediateModifyContentUseCase =
      cardImmediateModifyContentUseCaseConstructor(
        loadCardMock,
        saveCardMock,
        emitSocketMock
      );
  });

  it(`
    Given an card content modify by card owner
    When modify a card content with single word start at the first word and end at the last word
    Then it should return true
  `, async () => {
    const exampleAccount = await createExampleAccount();
    const exampleCard = {
      ...createExampleCard(exampleAccount.id),
      content:
        "Hello, I am a Ray\n" +
        "Like cats and dogs\n" +
        "I am a software engineer",
    };
    loadCardMock.mockResolvedValue(exampleCard);
    saveCardMock.mockResolvedValue(undefined);
    emitSocketMock.mockReturnValue(undefined);

    // 抓取第二行的 Like ，並取代為 love
    const mockContentModifyEvent: ContentModifyEvent = {
      accountId: exampleAccount.id,
      cardId: exampleCard.id,
      startLine: 1,
      startColumn: -1,
      startTarget: "",
      endLine: 1,
      endColumn: 4,
      endTarget: " ",
      insertText: "Love",
    };

    await cardImmediateModifyContentUseCase(mockContentModifyEvent);

    expect(loadCardMock).toHaveBeenCalledWith({ id: exampleCard.id });
    expect(saveCardMock).toHaveBeenCalledWith(
      expect.objectContaining({
        ...exampleCard,
        content:
          "Hello, I am a Ray\n" +
          "Love cats and dogs\n" +
          "I am a software engineer",
      })
    );
    expect(emitSocketMock).toHaveBeenCalledWith({
      event: "card:modify-content",
      data: mockContentModifyEvent,
      room: `card-${exampleCard.id}`,
    });
  });

  it(`
    Given an card content modify by card owner
    When modify a card content with multiple lines start at the first word and end at the last word
    Then it should return true
  `, async () => {
    const exampleAccount = await createExampleAccount();
    const exampleCard = {
      ...createExampleCard(exampleAccount.id),
      content:
        "Hello, I am a Ray\n" +
        "Like cats and dogs\n" +
        "I am a software engineer\n" +
        "Do you like me?",
    };
    loadCardMock.mockResolvedValue(exampleCard);
    saveCardMock.mockResolvedValue(undefined);
    emitSocketMock.mockReturnValue(undefined);

    const mockContentModifyEvent: ContentModifyEvent = {
      accountId: exampleAccount.id,
      cardId: exampleCard.id,
      startLine: 1,
      startColumn: -1,
      startTarget: "",
      endLine: 2,
      endColumn: 15,
      endTarget: " ",
      insertText: "Love Cat\nDo you like Cat?\nAnd I also as a software",
    };

    await cardImmediateModifyContentUseCase(mockContentModifyEvent);

    expect(loadCardMock).toHaveBeenCalledWith({ id: exampleCard.id });
    expect(saveCardMock).toHaveBeenCalledWith({
      ...exampleCard,
      content:
        "Hello, I am a Ray\n" +
        "Love Cat\n" +
        "Do you like Cat?\n" +
        "And I also as a software engineer\n" +
        "Do you like me?",
    });
    expect(emitSocketMock).toHaveBeenCalledWith({
      event: "card:modify-content",
      data: mockContentModifyEvent,
      room: `card-${exampleCard.id}`,
    });
  });

  it(`
    Given an card content modify by card owner
    When modify a card content with multiple lines start
    Then it should return true
  `, async () => {
    const exampleAccount = await createExampleAccount();
    const exampleCard = {
      ...createExampleCard(exampleAccount.id),
      content:
        "Hello, I am a Ray\n" +
        "Like cats and dogs\n" +
        "I am a software engineer\n" +
        "Do you like me?",
    };
    loadCardMock.mockResolvedValue(exampleCard);
    saveCardMock.mockResolvedValue(undefined);
    emitSocketMock.mockReturnValue(undefined);

    const mockContentModifyEvent: ContentModifyEvent = {
      accountId: exampleAccount.id,
      cardId: exampleCard.id,
      startLine: 1,
      startColumn: 4,
      startTarget: " ",
      endLine: 2,
      endColumn: 11,
      endTarget: "w",
      insertText: "hard",
    };

    await cardImmediateModifyContentUseCase(mockContentModifyEvent);

    expect(loadCardMock).toHaveBeenCalledWith({ id: exampleCard.id });
    expect(saveCardMock).toHaveBeenCalledWith({
      ...exampleCard,
      content:
        "Hello, I am a Ray\n" + "Like hardware engineer\n" + "Do you like me?",
    });
    expect(emitSocketMock).toHaveBeenCalledWith({
      event: "card:modify-content",
      data: mockContentModifyEvent,
      room: `card-${exampleCard.id}`,
    });
  });

  it(`
    Given an private card content modify other user
    When modify a card content
    Then it should throw an error
  `, async () => {
    const exampleAccount = await createExampleAccount();
    const exampleCard = {
      ...createExampleCard(exampleAccount.id),
      permission: CardPermission.Private,
      content:
        "Hello, I am a Ray\n" +
        "Like cats and dogs\n" +
        "I am a software engineer" +
        "Do you like me?",
    };
    loadCardMock.mockResolvedValue(exampleCard);
    saveCardMock.mockResolvedValue(undefined);
    emitSocketMock.mockReturnValue(undefined);

    const mockContentModifyEvent: ContentModifyEvent = {
      accountId: "other-user-id",
      cardId: exampleCard.id,
      startLine: 1,
      startColumn: 4,
      startTarget: " ",
      endLine: 2,
      endColumn: 11,
      endTarget: "w",
      insertText: "hard",
    };

    expect(
      cardImmediateModifyContentUseCase(mockContentModifyEvent)
    ).rejects.toThrow();
  });

  it(`
    Given an public editable card content modify other user
    When modify a card content
    Then it should return true
  `, async () => {
    const exampleAccount = await createExampleAccount();
    const exampleCard = {
      ...createExampleCard(exampleAccount.id),
      permission: CardPermission.PublicEditable,
      content:
        "Hello, I am a Ray\n" +
        "Like cats and dogs\n" +
        "I am a software engineerDo you like me?",
    };
    loadCardMock.mockResolvedValue(exampleCard);
    saveCardMock.mockResolvedValue(undefined);
    emitSocketMock.mockReturnValue(undefined);

    const mockContentModifyEvent: ContentModifyEvent = {
      accountId: "other-user-id",
      cardId: exampleCard.id,
      startLine: 1,
      startColumn: 4,
      startTarget: " ",
      endLine: 2,
      endColumn: 11,
      endTarget: "w",
      insertText: "hard",
    };

    await cardImmediateModifyContentUseCase(mockContentModifyEvent);

    expect(loadCardMock).toHaveBeenCalledWith({ id: exampleCard.id });
    expect(saveCardMock).toHaveBeenCalledWith({
      ...exampleCard,
      content:
        "Hello, I am a Ray\n" + "Like hardware engineer" + "Do you like me?",
    });
    expect(emitSocketMock).toHaveBeenCalledWith({
      event: "card:modify-content",
      data: mockContentModifyEvent,
      room: `card-${exampleCard.id}`,
    });
  });
});
