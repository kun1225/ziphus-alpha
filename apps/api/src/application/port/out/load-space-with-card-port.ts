import type Card from "@/application/domain/model/card";
import type Space from "@/application/domain/model/space";
import type { SpaceCard } from "@/application/domain/model/space";

export type LoadSpaceWithCardPort = (where: Partial<Space>) => Promise<
  | (Space & {
      spaceCards: (SpaceCard & {
        card: Card | null;
      })[];
    })
  | null
>;
