import fs from "node:fs";
import type Card from "@/application/domain/model/card";
import type { DeleteCardPort } from "@/application/port/out/delete-card-port";

const CardPersistenceDeleteAdapter: DeleteCardPort = async (card: Card) => {
  const dataPath = "./persistence/cards.json";
  // 讀取檔案
  const data = fs.readFileSync(dataPath, "utf8");
  let cards = JSON.parse(data) ?? [];
  // 刪除資料
  cards = cards.filter((c: any) => c.id !== card.id);
  // 寫入檔案
  fs.writeFileSync(dataPath, JSON.stringify(cards));
};

export default CardPersistenceDeleteAdapter;
