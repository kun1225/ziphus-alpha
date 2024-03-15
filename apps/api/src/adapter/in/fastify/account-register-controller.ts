import { AccountRegisterUseCase } from "@/application/port/in/account-register-use-case";
import FastifyControllerInterface from "./fastify-controller-interface";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  createApiResponseDTOSchema,
  AccountRegisterRequestDTOSchema,
  AccountRegisterResponseDTOSchema,
} from "shared-types";

const accountRegisterController: FastifyControllerInterface<
  AccountRegisterUseCase
> = (fastify, accountRegisterUseCase) => {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/account/register",
    schema: {
      body: AccountRegisterRequestDTOSchema,
      response: {
        200: createApiResponseDTOSchema(AccountRegisterResponseDTOSchema),
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
          data: {
            authorization,
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

export default accountRegisterController;
