import {
  OptionalAuthorizationHeaderSchema,
  CardModifySizeRequestDTOSchema,
} from "@repo/shared-types";
import { z } from "zod";
import type { CardModifySizeUseCase } from "@/application/port/in/card-modify-size-use-case";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import type FastifyControllerInterface from "./fastify-controller-interface";
import { EmitSocketPort } from "@/application/port/out/emit-socket-port";

const cardModifySizeController: FastifyControllerInterface<
  [CardModifySizeUseCase, EmitSocketPort]
> = (fastify, [cardModifyTitleUseCase, emitSocket]) => {
  fastify.route({
    method: "PUT",
    url: "/card/:id/size",
    schema: {
      summary: "嘗試修改卡片大小",
      tags: ["Card"],
      headers: OptionalAuthorizationHeaderSchema,
      params: z.object({
        id: z.string(),
      }),
      body: CardModifySizeRequestDTOSchema,
      response: {
        200: z.boolean(),
      },
    },
    handler: async (request, reply) => {
      const accountToken = getAccountTokenInterfaceFromAuth(request.headers);
      const cardId = request.params.id;
      const height = request.body.height;
      const width = request.body.width;

      try {
        await cardModifyTitleUseCase({
          accountId: accountToken?.accountId,
          cardId,
          height,
          width,
        });

        return emitSocket({
          event: `card:${cardId}:size-modified`,
          data: {
            height,
            width,
          },
        });
      } catch (error) {
        reply.code(400);
        console.error(error);
        throw error;
      }
    },
  });
};

export default cardModifySizeController;
