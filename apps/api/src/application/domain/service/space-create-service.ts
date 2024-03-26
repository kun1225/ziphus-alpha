import { randomUUID } from "node:crypto";
import { type SpaceCreateUseCaseConstructor } from "@/application/port/in/space-create-use-case";
import Space, { SpacePermission } from "../model/space";

const spaceCreateUseCaseConstructor: SpaceCreateUseCaseConstructor =
  (loadAccount, saveSpace) =>
  async ({ accountId }) => {
    const existingAccount = await loadAccount({ id: accountId });
    if (!existingAccount) {
      throw new Error("Account not found");
    }

    const newSpace = new Space(
      randomUUID(),
      accountId,
      "New Space",
      SpacePermission.Private,
      [],
      [],
      new Date().toISOString(),
      new Date().toISOString(),
      null
    );

    await saveSpace(newSpace);

    return newSpace;
  };

export default spaceCreateUseCaseConstructor;
