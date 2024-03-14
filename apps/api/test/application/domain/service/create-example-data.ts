import Account from "@/application/domain/model/account";
import Card, { CardPermission } from "@/application/domain/model/card";
import hash from "@/common/hash";
import { randomUUID } from "crypto";

export const examplePassword = "test-password";

export async function createExampleAccount() {
  const hashedExamplePassword = await hash(examplePassword);

  return new Account(
    randomUUID(),
    null,
    "test@example.com",
    "Test User",
    hashedExamplePassword,
    new Date().toISOString(),
    new Date().toISOString(),
    null
  );
}

export function createExampleCard(accountId: string) {
  return new Card(
    randomUUID(),
    accountId,
    CardPermission.Private,
    "",
    "",
    1280,
    1280,
    [],
    new Date().toISOString(),
    new Date().toISOString(),
    null
  );
}
