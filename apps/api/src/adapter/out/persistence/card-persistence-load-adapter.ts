import fs from "node:fs";
import type { LoadCardPort } from "@/application/port/out/load-card-port";

const CardPersistenceLoadAdapter: LoadCardPort = async (where) => {
  const dataPath = "./data/Cards.json";
  // 讀取檔案
  const data = fs.readFileSync(dataPath, "utf8");
  const cards = JSON.parse(data);

  // 查詢資料
  const findKeys = Object.keys(where);
  for (const findKey of findKeys) {
    const card = cards.find(
      (card: any) => card[findKey] === where[findKey as keyof typeof where]
    );
    if (card) {
      return card;
    }
  }
  return null;
};

export default CardPersistenceLoadAdapter;
