import fs from "node:fs";
import type Card from "@/application/domain/model/card";
import type { SaveCardPort } from "@/application/port/out/save-card-port";

const CardPersistenceSaveAdapter: SaveCardPort = async (card: Card) => {
  const dataPath = "./persistence/cards.json";
  // 讀取檔案
  const data = fs.readFileSync(dataPath, "utf8");
  let cards = JSON.parse(data) ?? [];
  // 新增資料
  if (!cards.find((c: any) => c.id === card.id)) {
    cards.push(card);
  } else {
    cards = cards.map((c: any) => {
      if (c.id === card.id) {
        return card;
      }
      return c;
    });
  }
  // 寫入檔案
  fs.writeFileSync(dataPath, JSON.stringify(cards));
};

export default CardPersistenceSaveAdapter;
