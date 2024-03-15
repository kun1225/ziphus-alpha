import {
  authorizationHeaderSchema,
  AccountMeResponseDTOSchema,
} from "@repo/shared-types";
import type { AccountGetInfoUseCase } from "@/application/port/in/account-get-info-use-case";
import { decodeToken } from "@/common/jwt-token";
import type AccountTokenInterface from "@/application/port/in/account-token-interface";
import type FastifyControllerInterface from "./fastify-controller-interface";

const accountMeController: FastifyControllerInterface<AccountGetInfoUseCase> = (
  fastify,
  accountGetInfoUseCase
) => {
  fastify.route({
    method: "GET",
    url: "/account/me",
    schema: {
      headers: authorizationHeaderSchema,
      response: {
        200: AccountMeResponseDTOSchema,
      },
    },
    handler: async (request, reply) => {
      try {
        const { authorization } = request.headers;
        if (!authorization) {
          throw new Error("Unauthorized");
        }
        const { accountId } = decodeToken<AccountTokenInterface>(authorization);

        const account = await accountGetInfoUseCase({ accountId });

        return {
          ...account,
          hashedPassword: undefined,
        };
      } catch (error) {
        reply.code(400);
        throw error;
      }
    },
  });
};

export default accountMeController;
