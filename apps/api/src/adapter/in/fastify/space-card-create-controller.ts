import {
  AuthorizationHeaderSchema,
  SpaceCardCreateResponseDTOSchema,
  SpacePermissionDTO,
} from "@repo/shared-types";
import type { SpaceCardCreateUseCase } from "@/application/port/in/space-card-create-use-case";
import type FastifyControllerInterface from "./fastify-controller-interface";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import z from "zod";

const spaceCardCreateController: FastifyControllerInterface<
  SpaceCardCreateUseCase
> = (fastify, spaceCardCreateUseCase) => {
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
      body: z.object({
        targetCardId: z.string(),
        x: z.number(),
        y: z.number(),
      }),
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
