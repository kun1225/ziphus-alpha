import { z } from "zod";

export const createApiResponseDTOSchema = <T>(schema: z.Schema<T>) =>
  z.object({
    data: schema.optional(),
    error: z.string().optional(),
  });
