import { type LoadCardPort } from "../out/load-card-port";
import { type SaveCardPort } from "../out/save-card-port";

export type CardAddImageUseCaseConstructor = (
  loadCard: LoadCardPort,
  saveCard: SaveCardPort
) => CardAddImageUseCase;

export type CardAddImageUseCase = (props: {
  accountId?: string;
  cardId: string;
  data: {
    url: string;
    key: string;
  };
}) => Promise<boolean>;
