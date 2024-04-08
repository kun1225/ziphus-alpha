import type { SpaceCard } from "@/application/domain/model/space";
import type { DeleteSpaceCardPort } from "@/application/port/out/delete-space-card-port";
import type { MongoCollections } from "./mongo-db";

const SpaceCardPersistenceDeleteAdapter =
  ({
    spaceCardCollection,
    spaceCollection,
  }: MongoCollections): DeleteSpaceCardPort =>
  async (spaceCard: SpaceCard) => {
    await spaceCardCollection.deleteOne({
      id: spaceCard.id,
    });

    await spaceCollection.updateMany(
      {
        layers: {
          $elemMatch: {
            spaceCardId: spaceCard.id,
          },
        },
      },
      {
        $pull: {
          layers: {
            spaceCardId: spaceCard.id,
          },
        },
      }
    );
  };

export default SpaceCardPersistenceDeleteAdapter;
