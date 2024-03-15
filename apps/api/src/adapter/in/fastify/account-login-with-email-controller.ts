import { AccountLoginWithEmailUseCase } from "@/application/port/in/account-login-with-email-use-case";
import FastifyControllerInterface from "./fastify-controller-interface";
import {
  AccountLoginWithEmailRequestDTOSchema,
  AccountLoginWithEmailResponseDTOSchema,
  createApiResponseDTOSchema,
} from "@repo/shared-types";

const accountLoginWithEmailController: FastifyControllerInterface<
  AccountLoginWithEmailUseCase
> = (fastify, accountLoginWithEmailUseCase) => {
  fastify.route({
    method: "POST",
    url: "/account/login-with-email",
    schema: {
      body: AccountLoginWithEmailRequestDTOSchema,
      response: {
        200: createApiResponseDTOSchema(AccountLoginWithEmailResponseDTOSchema),
      },
    },
    handler: async (request, reply) => {
      const { email, password } = request.body;
      try {
        const authorization = await accountLoginWithEmailUseCase({
          email,
          password,
        });
        return {
          data: {
            authorization,
          },
        };
      } catch (error) {
        reply.code(401).send({
          error: (error as any).message,
        });
      }
    },
  });
};

export default accountLoginWithEmailController;
