import type { LoadSpaceCardListPort } from "@/application/port/out/load-space-card-list-port";
import type { MongoCollections } from "./mongo-db";

const SpaceCardListPersistenceLoadAdapter = (
  { spaceCardCollection }: MongoCollections
): LoadSpaceCardListPort => async (
  where
) => {
    const spaceCardList = await spaceCardCollection
      .find({
        ...where
      })
      .toArray();

    return spaceCardList;
  };

export default SpaceCardListPersistenceLoadAdapter;
