import { AuthorizationHeaderSchema } from "@repo/shared-types";
import type { SpaceCardDeleteUseCase } from "@/application/port/in/space-card-delete-use-case";
import type FastifyControllerInterface from "./fastify-controller-interface";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import z from "zod";

const spaceCardDeleteController: FastifyControllerInterface<
  SpaceCardDeleteUseCase
> = (fastify, spaceCardDeleteUseCase) => {
  fastify.route({
    method: "DELETE",
    url: "/space-card/:spaceCardId",
    schema: {
      summary: "刪除指定空間的空間卡片",
      tags: ["SpaceCard"],
      headers: AuthorizationHeaderSchema,
      params: z.object({
        spaceCardId: z.string(),
      }),
      body: z.object({
        targetCardId: z.string(),
        x: z.number(),
        y: z.number(),
      }),
      response: {
        200: z.boolean(),
      },
    },
    handler: async (request, reply) => {
      const accountToken = getAccountTokenInterfaceFromAuth(request.headers);
      const spaceCardId = request.params.spaceCardId;
      if (!accountToken) {
        reply.code(401);
        throw new Error("Unauthorized");
      }

      try {
        return await spaceCardDeleteUseCase({
          accountId: accountToken.accountId,
          spaceCardId,
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
