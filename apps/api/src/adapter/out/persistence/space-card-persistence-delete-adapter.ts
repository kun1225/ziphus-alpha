import fs from "node:fs";
import type { SpaceCard } from "@/application/domain/model/space";
import type { DeleteSpaceCardPort } from "@/application/port/out/delete-space-card-port";

const SpaceCardPersistenceDeleteAdapter: DeleteSpaceCardPort = async (
  spaceCard: SpaceCard
) => {
  const dataPath = "./persistence/space-cards.json";
  // 讀取檔案
  const data = fs.readFileSync(dataPath, "utf8");
  let spaceCards = JSON.parse(data) ?? [];
  // 刪除資料
  spaceCards = spaceCards.filter((c: any) => c.id !== spaceCard.id);
  // 寫入檔案
  fs.writeFileSync(dataPath, JSON.stringify(spaceCards));
};

export default SpaceCardPersistenceDeleteAdapter;
