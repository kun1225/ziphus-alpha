import fs from "node:fs";
import type { LoadSpaceCardListPort } from "@/application/port/out/load-space-card-list-port";

const SpaceCardListPersistenceLoadAdapter: LoadSpaceCardListPort = async (
  where
) => {
  const dataPath = "./persistence/space-cards.json";
  // 讀取檔案
  const data = fs.readFileSync(dataPath, "utf8");
  const spaceCards = JSON.parse(data) ?? [];

  // 查詢資料
  const findKeys = Object.keys(where);
  const resultSpaceCards = spaceCards.filter((card: any) => {
    for (const findKey of findKeys) {
      return spaceCards.find(
        (card: any) => card[findKey] === where[findKey as keyof typeof where]
      );
    }
  });
  return resultSpaceCards;
};

export default SpaceCardListPersistenceLoadAdapter;
