import { type CardImmediateModifyContentUseCaseConstructor } from "@/application/port/in/card-immediate-modify-content-use-case";
import { CardPermission } from "../model/card";

const cardGetWithAllUseCaseConstructor: CardImmediateModifyContentUseCaseConstructor =
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

    const { cardId, startLine, startColumn, endLine, endColumn, insertText } =
      contentModifyEvent;
    // 分割內容成行
    const lines = card.content.split("\n");

    // 取得要修改的行
    const modifyLines = lines.slice(startLine, endLine + 1);

    // 修改內容
    const modifiedLines = modifyLines.map((line, index) => {
      if (index === 0 && index === modifyLines.length - 1) {
        // 修改範圍在同一行
        return (
          line.slice(0, startColumn + 1) + insertText + line.slice(endColumn)
        );
      } else if (index === 0) {
        // 修改範圍起始行
        return line.slice(0, startColumn + 1) + insertText;
      } else if (index === modifyLines.length - 1) {
        // 修改範圍結束行
        return line.slice(endColumn);
      } else {
        // 修改範圍中間行
        return "";
      }
    });

    // 更新卡片內容
    const startLines = lines.slice(0, startLine);
    const endLines = lines.slice(endLine + 1);
    const updatedContent =
      startLines.join("\n") +
      "\n" +
      modifiedLines.filter((line) => line !== "").join("") +
      (endLines.length > 0 ? "\n" + endLines.join("\n") : "");

    // 儲存更新後的卡片
    await saveCard({ ...card, content: updatedContent });

    // 發送即時修改內容的事件
    emitSocket({
      event: "card-immediate-modify-content",
      data: contentModifyEvent,
      namespace: `/card/${cardId}`,
    });

    return true;
  };

export default cardGetWithAllUseCaseConstructor;
