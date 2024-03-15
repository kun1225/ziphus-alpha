import {
  authorizationHeaderSchema,
  CardCreateResponseDTOSchema,
} from "@repo/shared-types";
import type { CardCreateUseCase } from "@/application/port/in/card-create-use-case";
import type FastifyControllerInterface from "./fastify-controller-interface";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";

const cardCreateController: FastifyControllerInterface<CardCreateUseCase> = (
  fastify,
  cardCreateUseCase
) => {
  fastify.route({
    method: "POST",
    url: "/card/create",
    schema: {
      headers: authorizationHeaderSchema,
      response: {
        200: CardCreateResponseDTOSchema,
      },
    },
    handler: async (request, reply) => {
      const accountToken = getAccountTokenInterfaceFromAuth(request.headers);
      if (!accountToken) {
        reply.code(401);
        throw new Error("Unauthorized");
      }

      try {
        const card = await cardCreateUseCase({
          accountId: accountToken.accountId,
        });
        return {
          card,
        };
      } catch (error) {
        reply.code(400);
        throw error;
      }
    },
  });
};

export default cardCreateController;
