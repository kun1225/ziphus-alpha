import { SpaceCard } from "@/application/domain/model/space";

export type DeleteSpaceCardPort = (spaceCard: SpaceCard) => Promise<void>;
