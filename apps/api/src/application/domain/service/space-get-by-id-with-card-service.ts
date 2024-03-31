import { type SpaceGetByIdWithCardUseCaseConstructor } from "@/application/port/in/space-get-by-id-with-card-use-case";
import { SpacePermission } from "../model/space";

const spaceGetByIdWithCardUseCaseConstructor: SpaceGetByIdWithCardUseCaseConstructor =
    (loadSpace) =>
    async ({ spaceId, accountId }) => {
      const space = await loadSpace({
        id: spaceId,
      });
      if (!space) {
        throw new Error("Space not found");
      }
      if (
        space.permission === SpacePermission.Private &&
        space.belongAccountId !== accountId
      ) {
        throw new Error("Card not found");
      }

      return space;
    };

export default spaceGetByIdWithCardUseCaseConstructor;
