import { z } from "zod";

export const CardGetByIdRequestDTOSchema = z.object({
  id: z.string(),
});

export type CardGetByIdRequestDTO = z.infer<typeof CardGetByIdRequestDTOSchema>;
