import fs from "node:fs";
import type { SaveSpaceCardPort } from "@/application/port/out/save-space-card-port";

const SpaceCardPersistenceSaveAdapter: SaveSpaceCardPort = async (
  spaceCard
) => {
  const dataPath = "./persistence/space-cards.json";
  // 讀取檔案
  const data = fs.readFileSync(dataPath, "utf8");
  let spaceCards = JSON.parse(data) ?? [];
  const newSpaceCard = {
    ...spaceCard,
    updatedAt: new Date().toISOString(),
  };
  // 新增資料
  if (!spaceCards.find((s: any) => s.id === spaceCard.id)) {
    spaceCards.push(newSpaceCard);
  } else {
    spaceCards = spaceCards.map((c: any) => {
      if (c.id === spaceCard.id) {
        return newSpaceCard;
      }
      return c;
    });
  }
  // 寫入檔案
  fs.writeFileSync(dataPath, JSON.stringify(spaceCards));
};

export default SpaceCardPersistenceSaveAdapter;
