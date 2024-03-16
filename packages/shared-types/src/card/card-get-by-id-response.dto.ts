import { z } from "zod";
import { cardDto } from "./card.dto";

export const CardGetByIdResponseDTOSchema = z.object({
  card: cardDto.nullable(),
});

export type CardGetByIdResponseDTO = z.infer<
  typeof CardGetByIdResponseDTOSchema
>;
