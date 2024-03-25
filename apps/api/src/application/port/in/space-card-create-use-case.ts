import type { SpaceCard } from "@/application/domain/model/space";
import { type LoadAccountPort } from "../out/load-account-port";
import { type SaveSpaceCardPort } from "../out/save-space-card-port";

export type SpaceCardCreateUseCaseConstructor = (loadAccount: LoadAccountPort, saveSpaceCard: SaveSpaceCardPort) => SpaceCardCreateUseCase;

/**
 * @returns {Promise<string>} - Login token
 */
export type SpaceCardCreateUseCase = (props: { accountId: string }) => Promise<SpaceCard>;
