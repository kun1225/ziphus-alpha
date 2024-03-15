import { FastifyBaseLogger, FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { Server, IncomingMessage, ServerResponse } from "http";

interface FastifyControllerInterface<T> {
  (
    fastify: FastifyInstance<
      Server<typeof IncomingMessage, typeof ServerResponse>,
      IncomingMessage,
      ServerResponse<IncomingMessage>,
      FastifyBaseLogger,
      ZodTypeProvider
    >,
    ...useCases: T[]
  ): void;
}

export default FastifyControllerInterface;
