import type Card from "@/application/domain/model/card";

export interface LoadCardListPort {
  (where: Partial<Card>): Promise<Card[] | null>;
}
