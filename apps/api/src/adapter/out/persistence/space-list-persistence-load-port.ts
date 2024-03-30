import type Space from "@/application/domain/model/space";
import type { LoadSpaceListPort } from "@/application/port/out/load-space-list-port";
import { MongoCollections } from './mongo-db';

const SpaceListPersistenceLoadAdapter = (
  { spaceCollection }: MongoCollections
): LoadSpaceListPort => async (where) => {
  const spaceList = await spaceCollection
    .aggregate([
      {
        $match: {
          ...where
        }
      },
      {
        $lookup: {
          from: "spaceCards",
          localField: "id",
          foreignField: "spaceId",
          as: "spaceCards"
        },
      }
    ])
    .toArray() as Space[];


  return spaceList;
};

export default SpaceListPersistenceLoadAdapter;
