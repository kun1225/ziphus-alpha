import fs from "node:fs";
import type { LoadSpacePort } from "@/application/port/out/load-space-port";
import SpaceCardListPersistenceLoadAdapter from "./space-card-list-persistence-load-adapter";

const SpacePersistenceLoadAdapter: LoadSpacePort = async (where) => {
  const dataPath = "./persistence/spaces.json";
  // 讀取檔案
  const data = fs.readFileSync(dataPath, "utf8");
  let spaces = JSON.parse(data) ?? [];

  // 查詢資料
  const findKeys = Object.keys(where);
  let space = null;
  for (const findKey of findKeys) {
    space = spaces.find(
      (space: any) => space[findKey] === where[findKey as keyof typeof where]
    );
    if (space) {
      break;
    }
  }

  if (!space) {
    return null;
  }

  const spaceCards = await SpaceCardListPersistenceLoadAdapter({
    targetSpaceId: space.id,
  });

  space.spaceCards = spaceCards;
  space.childSpaces = [];

  return space;
};

export default SpacePersistenceLoadAdapter;
