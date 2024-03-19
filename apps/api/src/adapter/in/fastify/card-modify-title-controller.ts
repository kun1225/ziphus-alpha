import {
  OptionalAuthorizationHeaderSchema,
  CardModifyTitleRequestDTOSchema,
} from "@repo/shared-types";
import type { CardModifyTitleUseCase } from "@/application/port/in/card-modify-title-use-case";
import type FastifyControllerInterface from "./fastify-controller-interface";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import { z } from "zod";

const cardModifyTitleController: FastifyControllerInterface<
  CardModifyTitleUseCase
> = (fastify, cardModifyTitleUseCase) => {
  fastify.route({
    method: "PUT",
    url: "/card/:id/title",
    schema: {
      summary: "修改卡片標題",
      tags: ["Card"],
      headers: OptionalAuthorizationHeaderSchema,
      params: z.object({
        id: z.string(),
      }),
      body: CardModifyTitleRequestDTOSchema,
      response: {
        200: z.boolean(),
      },
    },
    handler: async (request, reply) => {
      const accountToken = getAccountTokenInterfaceFromAuth(request.headers);
      const cardId = request.params.id;
      const title = request.body.title;

      try {
        return await cardModifyTitleUseCase({
          accountId: accountToken?.accountId,
          cardId,
          title,
        });
      } catch (error) {
        reply.code(400);
        console.error(error);
        throw error;
      }
    },
  });
};

export default cardModifyTitleController;
