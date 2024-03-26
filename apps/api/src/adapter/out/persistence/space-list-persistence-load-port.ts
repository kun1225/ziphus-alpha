import fs from "node:fs";
import type { LoadSpaceListPort } from "@/application/port/out/load-space-list-port";
import SpaceCardListPersistenceLoadAdapter from "./space-card-list-persistence-load-adapter";

const SpaceListPersistenceLoadAdapter: LoadSpaceListPort = async (where) => {
  const dataPath = "./persistence/spaces.json";
  // 讀取檔案
  const data = fs.readFileSync(dataPath, "utf8");
  const spaces = JSON.parse(data) ?? [];

  // 查詢資料
  const findKeys = Object.keys(where);
  const resultSpaces = spaces.filter((card: any) => {
    for (const findKey of findKeys) {
      return spaces.find(
        (card: any) => card[findKey] === where[findKey as keyof typeof where]
      );
    }
  });
  const resultSpacesWithSpaceCards = [];
  for (const space of resultSpaces) {
    const spaceCards = await SpaceCardListPersistenceLoadAdapter({
      targetSpaceId: space.id,
    });

    resultSpacesWithSpaceCards.push({
      ...space,
      spaceCards,
      childSpaces: [],
    });
  }

  return resultSpacesWithSpaceCards;
};

export default SpaceListPersistenceLoadAdapter;
