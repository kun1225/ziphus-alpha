import {
  OptionalAuthorizationHeaderSchema,
  CardModifyContentRequestDTOSchema,
} from "@repo/shared-types";
import type { CardModifyContentUseCase } from "@/application/port/in/card-modify-content-use-case";
import type FastifyControllerInterface from "./fastify-controller-interface";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import { z } from "zod";

const cardModifyContentController: FastifyControllerInterface<
  CardModifyContentUseCase
> = (fastify, cardModifyContentUseCase) => {
  fastify.route({
    method: "PUT",
    url: "/card/:id/content",
    schema: {
      summary: "嘗試修改卡片內容",
      tags: ["Card"],
      headers: OptionalAuthorizationHeaderSchema,
      params: z.object({
        id: z.string(),
      }),
      body: CardModifyContentRequestDTOSchema,
      response: {
        200: z.boolean(),
      },
    },
    handler: async (request, reply) => {
      const accountToken = getAccountTokenInterfaceFromAuth(request.headers);
      const cardId = request.params.id;
      const content = request.body.content;

      try {
        return await cardModifyContentUseCase({
          accountId: accountToken?.accountId,
          cardId,
          content,
        });
      } catch (error) {
        reply.code(400);
        console.error(error);
        throw error;
      }
    },
  });
};

export default cardModifyContentController;
