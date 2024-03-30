import { Db } from 'mongodb'
import type Space from "@/application/domain/model/space";
import type { SaveSpacePort } from "@/application/port/out/save-space-port";
import { MongoCollections } from './mongo-db';

const SpacePersistenceSaveAdapter = (
  { spaceCollection, spaceCardCollection }: MongoCollections
): SaveSpacePort => async (space) => {

  await spaceCollection.updateOne(
    {
      id: space.id
    },
    {
      $set: {
        ...space,
        childSpaces: undefined,
        spaceCards: undefined
      }
    },
    {
      upsert: true
    }
  );
};

export default SpacePersistenceSaveAdapter;
