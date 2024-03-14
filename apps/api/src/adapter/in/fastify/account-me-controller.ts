import { AccountGetInfoUseCase } from "@/application/port/in/account-get-info-use-case";
import FastifyControllerInterface from "./fastify-controller-interface";
import { decodeToken } from "@/common/jwt-token";
import AccountTokenInterface from "@/application/port/in/account-token-interface";

const accountMeController: FastifyControllerInterface<AccountGetInfoUseCase> = (
  fastify,
  accountGetInfoUseCase
) => {
  fastify.route({
    method: "GET",
    url: "/account/me",
    schema: {
      headers: {
        type: "object",
        required: ["authorization"],
        properties: {
          authorization: { type: "string" },
        },
      },
      response: {
        200: {
          type: "object",
        },
      },
    },
    handler: async (request, reply) => {
      const { authorization } = request.headers as {
        authorization: string;
      };

      if (!authorization) {
        reply.code(401).send("Unauthorized");
        return;
      }

      const { accountId } = decodeToken<AccountTokenInterface>(authorization);

      try {
        reply
          .header("Content-Type", "application/json; charset=utf-8")
          .send(JSON.stringify(await accountGetInfoUseCase({ accountId })));
      } catch (error) {
        reply.code(401).send(error);
      }
    },
  });
};

export default accountMeController;
