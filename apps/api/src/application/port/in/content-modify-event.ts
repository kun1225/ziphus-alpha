export interface ContentModifyEvent {
  accountId: string;
  // 從第幾行開始
  startLine: number;
  // 從第幾列開始
  startColumn: number;
  // 起始點的字元(容錯機制，避免誤判)
  startTarget: string;
  // 從第幾行結束
  endLine: number;
  // 從第幾列結束
  endColumn: number;
  // 結束點的字元(容錯機制，避免誤判)
  endTarget: string;
  // 要插入的文字，請注意插入時是不會取代起始點與結束點的文字
  insertText: string;
}
