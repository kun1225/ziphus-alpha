import type Space from "@/application/domain/model/space";
import { type LoadAccountPort } from "../out/load-account-port";
import { type SaveSpacePort } from "../out/save-space-port";
import { LoadSpaceListPort } from "../out/load-space-list-port";

export type SpaceGetWithAllUseCaseConstructor = (loadAccount: LoadAccountPort, loadSpaceList: LoadSpaceListPort) => SpaceGetWithAllUseCase;

/**
 * @returns {Promise<string>} - Login token
 */
export type SpaceGetWithAllUseCase = (props: { accountId: string }) => Promise<Space[]>;
