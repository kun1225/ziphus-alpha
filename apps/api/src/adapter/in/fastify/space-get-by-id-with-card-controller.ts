import type { SpaceGetByIdWithCardResponseDTO } from "@repo/shared-types";
import {
  AuthorizationHeaderSchema,
  SpaceGetByIdWithCardResponseDTOSchema,
  SpacePermissionDTO,
} from "@repo/shared-types";
import { z } from "zod";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import type { SpaceGetByIdWithCardUseCase } from "@/application/port/in/space-get-by-id-with-card-use-case";
import type Card from "@/application/domain/model/card";
import type { SpaceCard } from "@/application/domain/model/space";
import type FastifyControllerInterface from "./fastify-controller-interface";

const spaceGetByIdWithCardController: FastifyControllerInterface<
  SpaceGetByIdWithCardUseCase
> = (fastify, spaceGetByIdUseCase) => {
  fastify.route({
    method: "GET",
    url: "/space/:spaceId/with-card",
    schema: {
      summary: "嘗試取得指定空間並包含所有卡片",
      tags: ["Space"],
      headers: AuthorizationHeaderSchema,
      params: z.object({
        spaceId: z.string(),
      }),
      response: {
        200: SpaceGetByIdWithCardResponseDTOSchema,
      },
    },
    handler: async (request, reply) => {
      try {
        const accountToken = getAccountTokenInterfaceFromAuth(request.headers);
        const spaceId = request.params.spaceId;
        const space = await spaceGetByIdUseCase({
          accountId: accountToken?.accountId,
          spaceId,
        });
        const spaceDto = (
          space
            ? {
                ...space,
                permission: SpacePermissionDTO[space.permission],
                spaceCards: space.spaceCards.map(
                  (
                    spaceCard: SpaceCard & {
                      card: Card | null;
                    }
                  ) => ({
                    ...spaceCard,
                    card: {
                      ...spaceCard.card,
                    },
                  })
                ),
                childSpaces: [],
              }
            : null
        ) as SpaceGetByIdWithCardResponseDTO["space"] | null;

        return {
          space: spaceDto,
        };
      } catch (error) {
        reply.code(400);
        console.error(error);
        throw error;
      }
    },
  });
};

export default spaceGetByIdWithCardController;
