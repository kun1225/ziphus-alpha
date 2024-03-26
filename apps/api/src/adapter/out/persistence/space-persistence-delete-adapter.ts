import fs from "node:fs";
import type Space from "@/application/domain/model/space";
import type { DeleteSpacePort } from "@/application/port/out/delete-space-port";

const SpacePersistenceDeleteAdapter: DeleteSpacePort = async (space: Space) => {
  const dataPath = "./persistence/spaces.json";
  // 讀取檔案
  const data = fs.readFileSync(dataPath, "utf8");
  let spaces = JSON.parse(data) ?? [];
  // 刪除資料
  spaces = spaces.filter((c: any) => c.id !== space.id);
  // 寫入檔案
  fs.writeFileSync(dataPath, JSON.stringify(spaces));
};

export default SpacePersistenceDeleteAdapter;
