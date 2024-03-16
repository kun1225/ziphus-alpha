import { z } from "zod";
import { cardDto } from "./card.dto";

export const CardGetWithAllResponseDTOSchema = z.object({
  cards: cardDto.array(),
});

export type CardGetWithAllResponseDTO = z.infer<
  typeof CardGetWithAllResponseDTOSchema
>;
