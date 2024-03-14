import type { LoadAccountPort } from "@/application/port/out/load-account-port";
import fs from "fs";

const AccountPersistenceLoadAdapter: LoadAccountPort = async (where) => {
  const dataPath = `./data/accounts.json`;
  // 讀取檔案
  const data = fs.readFileSync(dataPath, "utf8");
  const accounts = JSON.parse(data);

  // 查詢資料
  const findKeys = Object.keys(where);
  for (const findKey of findKeys) {
    const account = accounts.find(
      (account: any) =>
        account[findKey] === where[findKey as keyof typeof where]
    );
    if (account) {
      return account;
    }
  }
  return null;
};

export default AccountPersistenceLoadAdapter;
