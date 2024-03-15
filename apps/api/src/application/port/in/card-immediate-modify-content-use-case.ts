import { type LoadCardPort } from "../out/load-card-port";
import { type SaveCardPort } from "../out/save-card-port";
import { type EmitSocketPort } from "../out/emit-socket-port";
import type { ContentModifyEvent } from "./content-modify-event";

export type CardImmediateModifyContentUseCaseConstructor = (
    loadCard: LoadCardPort,
    saveCard: SaveCardPort,
    emitSocket: EmitSocketPort
  ) => CardImmediateModifyContentUseCase;

export type CardImmediateModifyContentUseCase = (props: ContentModifyEvent) => Promise<boolean>;
