import { AuthorizationHeaderSchema } from "@repo/shared-types";
import type { SpaceCardDeleteUseCase } from "@/application/port/in/space-card-delete-use-case";
import type FastifyControllerInterface from "./fastify-controller-interface";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import z from "zod";
import { EmitSocketPort } from "@/application/port/out/emit-socket-port";

const spaceCardDeleteController: FastifyControllerInterface<
  [SpaceCardDeleteUseCase, EmitSocketPort]
> = (fastify, [spaceCardDeleteUseCase, emitSocket]) => {
  fastify.route({
    method: "DELETE",
    url: "/space/:spaceId/space-card/:spaceCardId",
    schema: {
      summary: "刪除指定空間的空間卡片",
      tags: ["SpaceCard"],
      headers: AuthorizationHeaderSchema,
      params: z.object({
        spaceCardId: z.string(),
        spaceId: z.string(),
      }),
      response: {
        200: z.boolean(),
      },
    },
    handler: async (request, reply) => {
      const accountToken = getAccountTokenInterfaceFromAuth(request.headers);
      const spaceCardId = request.params.spaceCardId;
      const spaceId = request.params.spaceId;
      if (!accountToken) {
        reply.code(401);
        throw new Error("Unauthorized");
      }

      try {
        return await spaceCardDeleteUseCase({
          accountId: accountToken.accountId,
          spaceCardId,
        });

        emitSocket({
          event: `space:card:delete`,
          data: {
            spaceCardId,
          },
          room: spaceId,
        });
      } catch (error) {
        reply.code(400);
        console.error(error);
        throw error;
      }
    },
  });
};

export default spaceCardDeleteController;
