import {
  AuthorizationHeaderSchema,
} from "@repo/shared-types";
import type { CardDeleteUseCase } from "@/application/port/in/card-delete-use-case";
import type FastifyControllerInterface from "./fastify-controller-interface";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import { z } from "zod";

const cardDeleteController: FastifyControllerInterface<
  CardDeleteUseCase
> = (fastify, cardDeleteUseCase) => {
  fastify.route({
    method: "DELETE",
    url: "/card/:id",
    schema: {
      summary: "刪除卡片",
      tags: ["Card"],
      headers: AuthorizationHeaderSchema,
      params: z.object({
        id: z.string(),
      }),
      response: {
        200: z.boolean(),
      },
    },
    handler: async (request, reply) => {
      const accountToken = getAccountTokenInterfaceFromAuth(request.headers);
      if (!accountToken) {
        reply.code(401);
        throw new Error("Unauthorized");
      }
      const cardId = request.params.id;

      try {
        return await cardDeleteUseCase({
          accountId: accountToken.accountId,
          cardId,
        });
      } catch (error) {
        reply.code(400);
        console.error(error);
        throw error;
      }
    },
  });
};

export default cardDeleteController;
