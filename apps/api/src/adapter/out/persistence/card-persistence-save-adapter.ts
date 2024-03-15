import fs from "node:fs";
import type Card from "@/application/domain/model/card";
import type { SaveCardPort } from "@/application/port/out/save-card-port";

const CardPersistenceSaveAdapter: SaveCardPort = async (card: Card) => {
  const dataPath = "./data/cards.json";
  // 讀取檔案
  const data = fs.readFileSync(dataPath, "utf8");
  const cards = JSON.parse(data);
  // 新增資料
  cards.push(card);
  // 寫入檔案
  fs.writeFileSync(dataPath, JSON.stringify(cards));
};

export default CardPersistenceSaveAdapter;
