import {
  authorizationHeaderSchema,
  CardPermissionDTO,
  CardStartEditSingleCardRequestDTOSchema,
  CardStartEditSingleCardResponseDTOSchema
} from "@repo/shared-types";
import type { CardGetByIdUseCase } from "@/application/port/in/card-get-by-id-use-case";
import type FastifyYJSControllerInterface from "./fastify-yjs-controller-interface";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";


const parser = new XMLParser();

const cardStartEditSingleCardController: FastifyYJSControllerInterface<CardGetByIdUseCase> = (
  fastify,
  ySocketIO,
  cardGetByIdUseCase
) => {
  fastify.route({
    method: "POST",
    url: "/card/start-edit-single-card",
    schema: {
      headers: authorizationHeaderSchema,
      body: CardStartEditSingleCardRequestDTOSchema,
      response: { 200: CardStartEditSingleCardResponseDTOSchema },
    },
    handler: async (request, reply) => {
      const accountToken = getAccountTokenInterfaceFromAuth(request.headers);
      const cardId = request.body.id;

      try {
        const card = await cardGetByIdUseCase({
          accountId: accountToken?.accountId,
          cardId
        });

        // transform card.content to xml
        // insert xml to y.doc with name card-{id}

        const cardDto = card
          ? {
            ...card,
            permission: CardPermissionDTO[card.permission],
          }
          : null;

        return {
          card: cardDto
        };
      } catch (error) {
        reply.code(400);
        throw error;
      }
    },
  });
};

export default cardStartEditSingleCardController;
