import { SpaceDeleteUseCaseConstructor } from "@/application/port/in/space-delete-use-case";

const spaceDeleteUseCaseConstructor: SpaceDeleteUseCaseConstructor =
  (loadSpace, deleteSpace) =>
  async ({ accountId, spaceId }) => {
    const existingSpace = await loadSpace({ id: spaceId });

    if (!existingSpace) {
      throw new Error("Space not found");
    }
    if (existingSpace.belongAccountId !== accountId) {
      throw new Error("Unauthorized");
    }

    await deleteSpace(existingSpace);

    return true;
  };

export default spaceDeleteUseCaseConstructor;
