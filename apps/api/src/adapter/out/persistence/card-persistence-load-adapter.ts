import fs from "node:fs";
import type { LoadCardPort } from "@/application/port/out/load-card-port";

function convertToArrayBuffer(arrayLike: {
  [key: string]: number;
}): Uint8Array {
  // 根據物件的長度建立一個新的 Uint8Array
  const length = Object.keys(arrayLike).length;
  const arrayBuffer = new Uint8Array(length);

  // 遍歷物件，將數值填充到 Uint8Array 中
  for (let i = 0; i < length; i++) {
    (arrayBuffer[i] as any) = arrayLike[i];
  }

  return arrayBuffer;
}

const CardPersistenceLoadAdapter: LoadCardPort = async (where) => {
  const dataPath = "./data/Cards.json";
  // 讀取檔案
  const data = fs.readFileSync(dataPath, "utf8");
  const cards = JSON.parse(data);

  // 查詢資料
  const findKeys = Object.keys(where);
  for (const findKey of findKeys) {
    const card = cards.find(
      (card: any) => card[findKey] === where[findKey as keyof typeof where]
    );
    if (card) {
      return {
        ...card,
        content: convertToArrayBuffer(card.content),
      };
    }
  }
  return null;
};

export default CardPersistenceLoadAdapter;
