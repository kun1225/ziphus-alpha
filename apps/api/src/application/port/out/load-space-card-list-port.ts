import { SpaceCard } from "@/application/domain/model/space";

export type LoadSpaceCardListPort = (where: Partial<SpaceCard>) => Promise<SpaceCard[] | null>;
