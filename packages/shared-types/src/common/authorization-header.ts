import { z } from "zod";

export const authorizationHeaderSchema = z.object({
  authorization: z.string(),
});

export type Authorization = z.infer<typeof authorizationHeaderSchema>;