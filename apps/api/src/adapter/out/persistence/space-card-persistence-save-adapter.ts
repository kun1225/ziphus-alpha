import type { SaveSpaceCardPort } from "@/application/port/out/save-space-card-port";
import { MongoCollections } from "./mongo-db";
import { SpaceCard } from "./mongo-schema";

interface SaveSpaceCardCommand {
  spaceCard: SpaceCard;
  saveTime: number;
}

const commandMap: Record<string, SaveSpaceCardCommand> = {};

const SpaceCardPersistenceSaveAdapter =
  ({ spaceCardCollection }: MongoCollections): SaveSpaceCardPort =>
  async (spaceCard, needRealTime?: boolean) => {
    // 為了避免在短時間內重複儲存相同的 SpaceCard，我們會在這裡加入一個緩存機制
    commandMap[spaceCard.id] = {
      spaceCard,
      saveTime: Date.now() + (needRealTime ? 0 : 3000),
    };

    async function handelCommand() {
      const needDealCommands = Object.values(commandMap).filter(
        ({ saveTime }) => saveTime <= Date.now() + 100
      );

      if (needDealCommands.length === 0) {
        return;
      }

      await spaceCardCollection.bulkWrite(
        needDealCommands.map(({ spaceCard }) => ({
          updateOne: {
            filter: { id: spaceCard.id },
            update: { $set: spaceCard },
            upsert: true,
          },
        }))
      );

      const needDealCommandIds = needDealCommands.map(
        ({ spaceCard }) => spaceCard.id
      );
      needDealCommandIds.forEach((id) => {
        delete commandMap[id];
      });
    }

    needRealTime ? await handelCommand() : setTimeout(handelCommand, 5000);
  };

export default SpaceCardPersistenceSaveAdapter;
