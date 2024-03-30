import type Card from "@/application/domain/model/card";
import type { SaveCardPort } from "@/application/port/out/save-card-port";
import { MongoCollections } from './mongo-db';

const CardPersistenceSaveAdapter = (
  { cardCollection }: MongoCollections
): SaveCardPort => async (card: Card) => {
  console.log('card', card);

  await cardCollection.updateOne(
    {
      id: card.id
    },
    {
      $set: {
        ...card,
      }
    },
    {
      upsert: true
    }
  );
};

export default CardPersistenceSaveAdapter;
