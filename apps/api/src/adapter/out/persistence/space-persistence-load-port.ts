import type { LoadSpacePort } from "@/application/port/out/load-space-port";
import { MongoCollections } from './mongo-db';

const SpacePersistenceLoadAdapter = (
  { spaceCollection, spaceCardCollection }: MongoCollections
): LoadSpacePort => async (where) => {
  const space = await spaceCollection
    .findOne({
      ...where
    });

  if (!space) {
    return null;
  }
  const spaceCards = await spaceCardCollection
    .find({
      spaceId: space.id
    })
    .toArray();

  return {
    ...space,
    spaceCards,
    childSpaces: []
  };
};

export default SpacePersistenceLoadAdapter;
