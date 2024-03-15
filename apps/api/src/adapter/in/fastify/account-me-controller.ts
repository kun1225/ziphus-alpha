import { AccountGetInfoUseCase } from "@/application/port/in/account-get-info-use-case";
import FastifyControllerInterface from "./fastify-controller-interface";
import { decodeToken } from "@/common/jwt-token";
import AccountTokenInterface from "@/application/port/in/account-token-interface";
import {
  authorizationHeaderSchema,
  AccountMeResponseDTOSchema,
  createApiResponseDTOSchema,
} from "@repo/shared-types";

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
        200: createApiResponseDTOSchema(AccountMeResponseDTOSchema),
      },
    },
    handler: async (request, reply) => {
      try {
        const { authorization } = request.headers;
        if (!authorization) {
          throw new Error("unauthorized");
        }
        const { accountId } = decodeToken<AccountTokenInterface>(authorization);

        const account = await accountGetInfoUseCase({ accountId });

        return {
          data: {
            ...account,
            hashedPassword: undefined,
          },
        };
      } catch (error) {
        reply.code(400).send({
          error: (error as any).message,
        });
      }
    },
  });
};

export default accountMeController;
