import {
  authorizationHeaderSchema,
  AccountMeResponseDTOSchema,
} from "@repo/shared-types";
import type { AccountGetInfoUseCase } from "@/application/port/in/account-get-info-use-case";
import type FastifyControllerInterface from "./fastify-controller-interface";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";

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
        const accountToken = getAccountTokenInterfaceFromAuth(request.headers);
        if (!accountToken) {
          reply.code(401);
          throw new Error("Unauthorized");
        }
        const account = await accountGetInfoUseCase({
          accountId: accountToken.accountId,
        });

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
