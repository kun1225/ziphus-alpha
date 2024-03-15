import type { CardPermission } from "@/application/domain/model/card";
import { type LoadCardPort } from "../out/load-card-port";
import { type SaveCardPort } from "../out/save-card-port";

export type CardSetPermissionUseCaseConstructor = (loadCard: LoadCardPort, saveCard: SaveCardPort) => CardSetPermissionUseCase;

export type CardSetPermissionUseCase = (props: {
    accountId: string;
    cardId: string;
    permission: CardPermission;
  }) => Promise<boolean>;
