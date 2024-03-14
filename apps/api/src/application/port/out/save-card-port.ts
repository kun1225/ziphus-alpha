import type Card from "@/application/domain/model/card";

export interface SaveCardPort {
  (card: Card): Promise<void>;
}
