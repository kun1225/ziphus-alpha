import type Card from "@/application/domain/model/card";
import type { SaveCardPort } from "@/application/port/out/save-card-port";
import { MongoCollections } from './mongo-db';

interface SaveCardCommand {
  card: Card;
  saveTime: number;
}

const commandMap: Record<string, SaveCardCommand> = {}

const CardPersistenceSaveAdapter = (
  { cardCollection }: MongoCollections
): SaveCardPort => async (card: Card) => {
  commandMap[card.id] = {
    card,
    saveTime: Date.now() + 3000
  }

  async function handelCommand() {
    const needDealCommands = Object.values(commandMap).
      filter(({ saveTime }) => saveTime < Date.now());

    if (needDealCommands.length === 0) {
      return;
    }

    await cardCollection.bulkWrite(
      needDealCommands.map(({ card }) => ({
        updateOne: {
          filter: { id: card.id },
          update: { $set: card },
          upsert: true
        }
      })));

    const needDealCommandIds = needDealCommands.map(({ card }) => card.id);
    needDealCommandIds.forEach(id => {
      delete commandMap[id];
    });
  }

  setTimeout(handelCommand, 5000);
};

export default CardPersistenceSaveAdapter;
