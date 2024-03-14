import { CardPermission } from "@/application/domain/model/card";
import { type LoadCardPort } from "../out/load-card-port";
import { type SaveCardPort } from "../out/save-card-port";

export interface CardSetPermissionUseCaseConstructor {
  (loadCard: LoadCardPort, saveCard: SaveCardPort): CardSetPermissionUseCase;
}

export interface CardSetPermissionUseCase {
  (props: {
    accountId: string;
    cardId: string;
    permission: CardPermission;
  }): Promise<Boolean>;
}
