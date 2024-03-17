import { type CardImmediateModifyContentUseCaseConstructor } from "@/application/port/in/card-immediate-modify-content-use-case";
import { CardPermission } from "../model/card";
import { applyContentModifyEvent } from "@repo/shared-utils";

const cardImmediateModifyContentCaseConstructor: CardImmediateModifyContentUseCaseConstructor =
  (loadCard, saveCard, emitSocket) => async (contentModifyEvent) => {
    const card = await loadCard({
      id: contentModifyEvent.cardId,
    });
    if (!card) {
      throw new Error("Card not found");
    }

    if (
      card.permission !== CardPermission.PublicEditable &&
      card.belongAccountId !== contentModifyEvent.accountId
    ) {
      throw new Error("Permission denied");
    }

    // 更新卡片內容
    const updatedContent = applyContentModifyEvent(
      card.content,
      contentModifyEvent
    );

    // 儲存更新後的卡片
    await saveCard({ ...card, content: updatedContent });

    // 發送即時修改內容的事件
    emitSocket({
      event: "card:modify-content",
      data: contentModifyEvent,
      room: `card-${card.id}`,
    });

    return true;
  };

export default cardImmediateModifyContentCaseConstructor;
