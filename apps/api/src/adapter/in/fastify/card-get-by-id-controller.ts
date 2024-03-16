import {
  authorizationHeaderSchema,
  CardGetByIdResponseDTOSchema,
  CardGetByIdRequestDTOSchema,
  CardPermissionDTO,
} from "@repo/shared-types";
import type { CardGetByIdUseCase } from "@/application/port/in/card-get-by-id-use-case";
import type FastifyControllerInterface from "./fastify-controller-interface";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";

const cardGetByIdController: FastifyControllerInterface<CardGetByIdUseCase> = (
  fastify,
  cardGetByIdUseCase
) => {
  fastify.route({
    method: "GET",
    url: "/card/get-by-id",
    schema: {
      querystring: CardGetByIdRequestDTOSchema,
      headers: authorizationHeaderSchema,
      response: {
        200: CardGetByIdResponseDTOSchema,
      },
    },
    handler: async (request, reply) => {
      const accountToken = getAccountTokenInterfaceFromAuth(request.headers);
      const cardId = request.query.id;

      try {
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
        throw error;
      }
    },
  });
};

export default cardGetByIdController;
