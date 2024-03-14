import { AccountRegisterUseCase } from "@/application/port/in/account-register-use-case";
import FastifyControllerInterface from "./fastify-controller-interface";

const accountRegisterController: FastifyControllerInterface<
  AccountRegisterUseCase
> = (fastify, accountRegisterUseCase) => {
  fastify.route({
    method: "POST",
    url: "/account/register",
    schema: {
      body: {
        type: "object",
        required: ["email", "name", "password"],
        properties: {
          email: { type: "string" },
          name: { type: "string" },
          password: { type: "string" },
        },
      },
      response: {
        200: {
          type: "string",
        },
      },
    },
    handler: async (request, reply) => {
      const { email, name, password } = request.body as {
        email: string;
        name: string;
        password: string;
      };
      return await accountRegisterUseCase({ email, name, password });
    },
  });
};

export default accountRegisterController;
