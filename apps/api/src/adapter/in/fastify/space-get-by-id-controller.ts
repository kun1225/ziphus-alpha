import {
  AuthorizationHeaderSchema,
  SpaceDto,
  SpaceGetByIdResponseDTOSchema,
  SpacePermissionDTO,
} from "@repo/shared-types";
import type FastifyControllerInterface from "./fastify-controller-interface";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import { SpaceGetByIdUseCase } from "@/application/port/in/space-get-by-id-use-case";
import { z } from "zod";

const spaceGetByIdController: FastifyControllerInterface<
  SpaceGetByIdUseCase
> = (fastify, spaceGetByIdUseCase) => {
  fastify.route({
    method: "GET",
    url: "/space/:spaceId",
    schema: {
      summary: "嘗試取得指定空間",
      tags: ["Space"],
      headers: AuthorizationHeaderSchema,
      params: z.object({
        spaceId: z.string(),
      }),
      response: {
        200: SpaceGetByIdResponseDTOSchema,
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
        const spaceDto: SpaceDto | null = space
          ? {
              ...space,
              permission: SpacePermissionDTO[space.permission],
            }
          : null;

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

export default spaceGetByIdController;
