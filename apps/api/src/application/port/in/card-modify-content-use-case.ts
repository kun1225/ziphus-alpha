import { type LoadCardPort } from "../out/load-card-port";
import { type SaveCardPort } from "../out/save-card-port";

export type CardModifyContentUseCaseConstructor = (
  loadCard: LoadCardPort,
  saveCard: SaveCardPort
) => CardModifyContentUseCase;

export type CardModifyContentUseCase = (props: {
  cardId: string;
  content: Uint8Array;
  // accountId?: string;
}) => Promise<boolean>;
