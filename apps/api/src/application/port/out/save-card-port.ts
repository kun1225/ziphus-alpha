import type Card from "@/application/domain/model/card";

export type SaveCardPort = (card: Card) => Promise<void>;
