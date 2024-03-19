import { type LoadCardPort } from "../out/load-card-port";
import { type DeleteCardPort } from "../out/delete-card-port";

export type CardDeleteUseCaseConstructor = (
  loadCard: LoadCardPort,
  deleteCard: DeleteCardPort
) => CardDeleteUseCase;

export type CardDeleteUseCase = (props: {
  accountId: string;
  cardId: string;
}) => Promise<boolean>;
