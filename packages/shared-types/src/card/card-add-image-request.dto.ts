import { z } from "zod";

export const CardAddImageRequestDTOSchema = z.object({
  key: z.string(),
  url: z.string(),
});

export type CardAddImageRequestDTO = z.infer<
  typeof CardAddImageRequestDTOSchema
>;
