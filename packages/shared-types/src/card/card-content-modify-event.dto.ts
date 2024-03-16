import { z } from "zod";

export const CardContentModifyEventDTOSchema = z.object({
  cardId: z.string(),
  startLine: z.number(),
  startColumn: z.number(),
  startTarget: z.string(),
  endLine: z.number(),
  endColumn: z.number(),
  endTarget: z.string(),
  insertText: z.string(),
});

export type CardContentModifyEventDTO = z.infer<
  typeof CardContentModifyEventDTOSchema
>;
