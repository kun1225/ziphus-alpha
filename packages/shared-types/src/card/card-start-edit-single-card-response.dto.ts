import { z } from "zod";
import { cardDtoSchema } from "./card.dto";

export const CardStartEditSingleCardResponseDTOSchema = z.object({
    card: cardDtoSchema.nullable(),
});

export type CardStartEditSingleCardResponseDTO = z.infer<typeof CardStartEditSingleCardResponseDTOSchema>;
