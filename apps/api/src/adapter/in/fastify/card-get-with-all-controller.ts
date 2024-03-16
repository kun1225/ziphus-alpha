import {
  authorizationHeaderSchema,
  CardGetWithAllResponseDTO,
  CardGetWithAllResponseDTOSchema,
  CardPermissionDTO,
} from "@repo/shared-types";
import type { CardGetWithAllUseCase } from "@/application/port/in/card-get-with-all-use-case";
import type FastifyControllerInterface from "./fastify-controller-interface";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
const cardGetWithAllController: FastifyControllerInterface<
  CardGetWithAllUseCase
> = (fastify, cardGetWithAllUseCase) => {
  fastify.route({
    method: "GET",
    url: "/card/get-with-all",
    schema: {
      headers: authorizationHeaderSchema,
      response: {
        200: CardGetWithAllResponseDTOSchema,
      },
    },
    handler: async (request, reply) => {
      const accountToken = getAccountTokenInterfaceFromAuth(request.headers);
      if (!accountToken) {
        reply.code(401);
        throw new Error("Unauthorized");
      }

      try {
        const cards =
          (await cardGetWithAllUseCase({
            accountId: accountToken.accountId,
          })) ?? [];
        const cardsDto = cards.map((card) => {
          return {
            ...card,
            permission: CardPermissionDTO[card.permission],
          };
        });
        return {
          cards: cardsDto,
        };
      } catch (error) {
        reply.code(400);
        throw error;
      }
    },
  });
};

export default cardGetWithAllController;
