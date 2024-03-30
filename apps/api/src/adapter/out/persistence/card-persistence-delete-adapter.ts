import type Card from "@/application/domain/model/card";
import type { DeleteCardPort } from "@/application/port/out/delete-card-port";
import { MongoCollections } from './mongo-db';

const CardPersistenceDeleteAdapter = (
  { cardCollection }: MongoCollections
): DeleteCardPort => async (card: Card) => {
  await cardCollection.deleteOne({
    id: card.id
  });
};

export default CardPersistenceDeleteAdapter;
