import type Space from "@/application/domain/model/space";
import { type LoadSpaceWithCardPort } from "../out/load-space-with-card-port";
import { SpaceCard } from "@/application/domain/model/space";
import Card from "@/application/domain/model/card";

export type SpaceGetByIdWithCardUseCaseConstructor = (
  loadSpaceWithCard: LoadSpaceWithCardPort
) => SpaceGetByIdWithCardUseCase;

export type SpaceGetByIdWithCardUseCase = (props: {
  spaceId: string;
  accountId?: string;
}) => Promise<
  | (Space & {
      spaceCards: (SpaceCard & {
        card: Card | null;
      })[];
    })
  | null
>;
