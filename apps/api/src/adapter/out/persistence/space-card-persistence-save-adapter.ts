import type { SaveSpaceCardPort } from "@/application/port/out/save-space-card-port";
import { MongoCollections } from "./mongo-db";

const SpaceCardPersistenceSaveAdapter = (
  { spaceCardCollection }: MongoCollections
): SaveSpaceCardPort => async (
  spaceCard
) => {
    await spaceCardCollection.updateOne(
      {
        id: spaceCard.id
      },
      {
        $set: {
          ...spaceCard
        }
      },
      {
        upsert: true
      }
    );
  };

export default SpaceCardPersistenceSaveAdapter;
