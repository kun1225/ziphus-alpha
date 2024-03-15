import {
  AccountRegisterRequestDTOSchema,
  AccountRegisterResponseDTOSchema,
} from "@repo/shared-types";
import type { AccountRegisterUseCase } from "@/application/port/in/account-register-use-case";
import type FastifyControllerInterface from "./fastify-controller-interface";

const accountRegisterController: FastifyControllerInterface<
  AccountRegisterUseCase
> = (fastify, accountRegisterUseCase) => {
  fastify.route({
    method: "POST",
    url: "/account/register",
    schema: {
      body: AccountRegisterRequestDTOSchema,
      response: {
        200: AccountRegisterResponseDTOSchema,
      },
    },
    handler: async (request, reply) => {
      const { email, name, password } = request.body;
      try {
        const authorization = await accountRegisterUseCase({
          email,
          name,
          password,
        });
        return {
          authorization,
        };
      } catch (error) {
        reply.code(400);
        throw error;
      }
    },
  });
};

export default accountRegisterController;
