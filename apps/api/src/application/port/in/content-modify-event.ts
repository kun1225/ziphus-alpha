export interface ContentModifyEvent {
  accountId?: string;
  cardId: string;
  // 從第幾個字元開始
  startPosition: number;
  // 到第幾個字元結束
  endPosition: number;
  // 要插入的文字，請注意插入時是不會取代起始點與結束點的文字
  insertText: string;
}
