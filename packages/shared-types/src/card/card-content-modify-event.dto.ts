import { z } from "zod";

export const CardContentModifyEventDTOSchema = z.object({
  socketId: z.string(),
  cardId: z.string(),
  startPosition: z.number(),
  endPosition: z.number(),
  insertText: z.string(),
});

export type CardContentModifyEventDTO = z.infer<
  typeof CardContentModifyEventDTOSchema
>;
