import { type LoadSpacePort } from "../out/load-space-port";
import { type DeleteSpaceCardPort } from "../out/delete-space-card-port";

export type SpaceCardDeleteUseCaseConstructor = (
    loadSpace: LoadSpacePort,
    deleteSpaceCard: DeleteSpaceCardPort
) => SpaceCardDeleteUseCase;

export type SpaceCardDeleteUseCase = (props: {
    accountId: string;
    spaceCardId: string;
}) => Promise<boolean>;
