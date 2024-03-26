import fs from "node:fs";
import type { LoadSpaceCardPort } from "@/application/port/out/load-space-card-port";

const SpaceCardPersistenceLoadAdapter: LoadSpaceCardPort = async (where) => {
  const dataPath = "./persistence/space-cards.json";
  // 讀取檔案
  const data = fs.readFileSync(dataPath, "utf8");
  let spaceCards = JSON.parse(data) ?? [];

  // 查詢資料
  const findKeys = Object.keys(where);
  for (const findKey of findKeys) {
    const card = spaceCards.find(
      (card: any) => card[findKey] === where[findKey as keyof typeof where]
    );
    if (card) {
      return card;
    }
  }

  return null;
};

export default SpaceCardPersistenceLoadAdapter;
