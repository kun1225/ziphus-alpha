import type Card from "@/application/domain/model/card";

export interface LoadCardPort {
  (where: Partial<Card>): Promise<Card | null>;
}
