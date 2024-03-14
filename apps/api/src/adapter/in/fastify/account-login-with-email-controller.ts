import { AccountLoginWithEmailUseCase } from "@/application/port/in/account-login-with-email-use-case";
import FastifyControllerInterface from "./fastify-controller-interface";

const accountLoginWithEmailController: FastifyControllerInterface<
  AccountLoginWithEmailUseCase
> = (fastify, accountLoginWithEmailUseCase) => {
  fastify.route({
    method: "POST",
    url: "/account/login-with-email",
    schema: {
      body: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string" },
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
      const { email, password } = request.body as {
        email: string;
        password: string;
      };
      try {
        return await accountLoginWithEmailUseCase({ email, password });
      } catch (error) {
        reply.code(401).send(error);
      }
    },
  });
};

export default accountLoginWithEmailController;
