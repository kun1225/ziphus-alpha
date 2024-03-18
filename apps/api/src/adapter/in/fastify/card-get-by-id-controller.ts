import {
  OptionalAuthorizationHeaderSchema,
  CardGetByIdResponseDTOSchema,
  CardGetByIdRequestDTOSchema,
  CardPermissionDTO,
} from "@repo/shared-types";
import type { CardGetByIdUseCase } from "@/application/port/in/card-get-by-id-use-case";
import type FastifyControllerInterface from "./fastify-controller-interface";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import { z } from "zod";

const cardGetByIdController: FastifyControllerInterface<CardGetByIdUseCase> = (
  fastify,
  cardGetByIdUseCase
) => {
  fastify.route({
    method: "GET",
    url: "/card/:id",
    schema: {
      summary: "嘗試取得該 ID 卡片",
      tags: ["Card"],
      params: CardGetByIdRequestDTOSchema,
      headers: OptionalAuthorizationHeaderSchema,
      response: {
        200: CardGetByIdResponseDTOSchema,
        400: z.string(),
      },
    },
    handler: async (request, reply) => {
      try {
        const accountToken = getAccountTokenInterfaceFromAuth(request.headers);
        const cardId = request.params.id;

        const card = await cardGetByIdUseCase({
          accountId: accountToken?.accountId,
          cardId: cardId,
        });
        const cardDto = card
          ? {
              ...card,
              permission: CardPermissionDTO[card.permission],
            }
          : null;

        return {
          card: cardDto,
        };
      } catch (error) {
        reply.code(400);
        console.error(error);
        throw error;
      }
    },
  });
};

export default cardGetByIdController;
