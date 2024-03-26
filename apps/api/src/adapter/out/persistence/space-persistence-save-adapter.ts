import fs from "node:fs";
import type { SaveSpacePort } from "@/application/port/out/save-space-port";

const SpacePersistenceSaveAdapter: SaveSpacePort = async (space) => {
  const dataPath = "./persistence/spaces.json";
  // 讀取檔案
  const data = fs.readFileSync(dataPath, "utf8");
  let spaces = JSON.parse(data) ?? [];
  const newSpace = {
    ...space,
    spaceCards: undefined,
    childSpaces: undefined,
    updatedAt: new Date().toISOString(),
  };
  // 新增資料
  if (!spaces.find((s: any) => s.id === space.id)) {
    spaces.push(newSpace);
  } else {
    spaces = spaces.map((c: any) => {
      if (c.id === space.id) {
        return newSpace;
      }
      return c;
    });
  }
  // 寫入檔案
  fs.writeFileSync(dataPath, JSON.stringify(spaces));
};

export default SpacePersistenceSaveAdapter;
