import { Db } from 'mongodb'
import type Card from "@/application/domain/model/card";
import type { LoadCardPort } from "@/application/port/out/load-card-port";
import { MongoCollections } from './mongo-db';

const CardPersistenceLoadAdapter = (
  { cardCollection }: MongoCollections
): LoadCardPort => async (where) => {
  const card = await cardCollection.findOne({
    ...where
  });

  return card;
};

export default CardPersistenceLoadAdapter;
