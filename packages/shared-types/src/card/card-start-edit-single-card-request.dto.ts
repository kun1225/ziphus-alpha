import { z } from "zod";

export const CardStartEditSingleCardRequestDTOSchema = z.object({
    id: z.string(),
});

export type CardStartEditSingleCardRequestDTO = z.infer<typeof CardStartEditSingleCardRequestDTOSchema>;
