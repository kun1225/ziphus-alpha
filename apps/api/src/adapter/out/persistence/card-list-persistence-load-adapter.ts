import fs from "node:fs";
import type { LoadCardListPort } from "@/application/port/out/load-card-list-port";

const CardListPersistenceLoadAdapter: LoadCardListPort = async (where) => {
  const dataPath = "./data/Cards.json";
  // 讀取檔案
  const data = fs.readFileSync(dataPath, "utf8");
  const cards = JSON.parse(data) ?? [];
  const findKeys = Object.keys(where);
  const resultCards = cards.filter((card: any) => {
    for (const findKey of findKeys) {
      return cards.find(
        (card: any) => card[findKey] === where[findKey as keyof typeof where]
      );
    }
  });

  return resultCards;
};

export default CardListPersistenceLoadAdapter;
