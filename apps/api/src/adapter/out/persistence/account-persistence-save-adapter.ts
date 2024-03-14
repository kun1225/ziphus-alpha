import type Account from "@/application/domain/model/account";
import type { SaveAccountPort } from "@/application/port/out/save-account-port";
import fs from "fs";

const AccountPersistenceSaveAdapter: SaveAccountPort = async (
  account: Account
) => {
  const dataPath = `./data/accounts.json`;
  // 讀取檔案
  const data = fs.readFileSync(dataPath, "utf8");
  const accounts = JSON.parse(data);
  // 新增資料
  accounts.push(account);
  // 寫入檔案
  fs.writeFileSync(dataPath, JSON.stringify(accounts));
};

export default AccountPersistenceSaveAdapter;
