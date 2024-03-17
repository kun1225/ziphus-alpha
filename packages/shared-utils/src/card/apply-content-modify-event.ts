import { CardContentModifyEventDTO } from "@repo/shared-types";

export function applyContentModifyEvent(
  content: string,
  contentModifyEvent: Omit<CardContentModifyEventDTO, "socketId">
): string {
  const { startPosition, endPosition, insertText } = contentModifyEvent;

  // 更新卡片內容
  const updatedContent =
    content.slice(0, startPosition + 1) +
    insertText +
    content.slice(endPosition);
  
  console.log(startPosition, endPosition, insertText);

  return updatedContent;
}
