import {
  AuthorizationHeaderSchema,
  SpaceCardCreateResponseDTOSchema,
  SpaceCardCreateRequestDTOSchema,
} from "@repo/shared-types";
import type { SpaceCardCreateUseCase } from "@/application/port/in/space-card-create-use-case";
import type FastifyControllerInterface from "./fastify-controller-interface";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import z from "zod";
import { EmitSocketPort } from "@/application/port/out/emit-socket-port";

const spaceCardCreateController: FastifyControllerInterface<
  [SpaceCardCreateUseCase, EmitSocketPort]
> = (fastify, [spaceCardCreateUseCase, emitSocket]) => {
  fastify.route({
    method: "POST",
    url: "/space/:spaceId/space-card",
    schema: {
      summary: "嘗試替指定空間建立卡片",
      tags: ["SpaceCard"],
      headers: AuthorizationHeaderSchema,
      params: z.object({
        spaceId: z.string(),
      }),
      body: SpaceCardCreateRequestDTOSchema,
      response: {
        200: SpaceCardCreateResponseDTOSchema,
      },
    },
    handler: async (request, reply) => {
      const accountToken = getAccountTokenInterfaceFromAuth(request.headers);
      const targetSpaceId = request.params.spaceId;
      const { targetCardId, x, y } = request.body;
      try {
        const spaceCard = await spaceCardCreateUseCase({
          accountId: accountToken?.accountId,
          targetCardId,
          targetSpaceId,
          x,
          y,
        });
        emitSocket({
          event: `space:card:create`,
          data: {
            spaceCard,
          },
          room: spaceCard.targetSpaceId,
        });
        return {
          spaceCard,
        };
      } catch (error) {
        reply.code(400);
        console.error(error);
        throw error;
      }
    },
  });
};

export default spaceCardCreateController;
