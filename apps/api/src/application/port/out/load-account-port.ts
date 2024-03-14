import type Account from "@/application/domain/model/account";

export interface LoadAccountPort {
  (where: Partial<Account>): Promise<Account | null>;
}
