import type { SpaceCard } from "@/application/domain/model/space";
import type { DeleteSpaceCardPort } from "@/application/port/out/delete-space-card-port";
import { MongoCollections } from './mongo-db';

const SpaceCardPersistenceDeleteAdapter = (
  { spaceCardCollection }: MongoCollections
): DeleteSpaceCardPort => async (
  spaceCard: SpaceCard
) => {
    await spaceCardCollection.deleteOne({
      id: spaceCard.id
    });
  };

export default SpaceCardPersistenceDeleteAdapter;
