import { z } from "zod";
import { SpaceDtoSchema } from "./space.dto";
import { cardDtoSchema } from "..";

export const SpaceGetByIdWithCardResponseDTOSchema = z.object({
  space: z
    .object({
      ...SpaceDtoSchema.shape,
      spaceCards: z.array(
        z.object({
          id: z.string(),
          targetCardId: z.string(),
          targetSpaceId: z.string(),
          x: z.number(),
          y: z.number(),
          card: cardDtoSchema.nullable(),
        })
      ),
    })
    .nullable(),
});

export type SpaceGetByIdWithCardResponseDTO = z.infer<
  typeof SpaceGetByIdWithCardResponseDTOSchema
>;
