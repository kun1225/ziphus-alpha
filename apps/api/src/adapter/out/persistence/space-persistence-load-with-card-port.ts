import type { LoadSpaceWithCardPort } from "@/application/port/out/load-space-with-card-port";
import type { SpaceCard } from "@/application/domain/model/space";
import type Card from "@/application/domain/model/card";
import type { MongoCollections } from "./mongo-db";

const SpacePersistenceLoadWithCardAdapter =
  ({
    spaceCollection,
    spaceCardCollection,
  }: MongoCollections): LoadSpaceWithCardPort =>
  async (where) => {
    const space = await spaceCollection.findOne(where);

    if (!space) {
      return null;
    }

    const spaceCards = (await spaceCardCollection
      .aggregate([
        {
          $match: {
            targetSpaceId: space.id,
          },
        },
        {
          $lookup: {
            from: "cards",
            localField: "targetCardId",
            foreignField: "id",
            as: "card",
          },
        },
        {
          $unwind: {
            path: "$card",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            id: "$id",
            targetCardId: 1,
            targetSpaceId: 1,
            x: 1,
            y: 1,
            card: 1,
          },
        },
      ])
      .toArray()) as (SpaceCard & {
      card: Card | null;
    })[];

    const spaceWithCard = {
      ...space,
      spaceCards,
    };

    return spaceWithCard as any;
  };

export default SpacePersistenceLoadWithCardAdapter;
