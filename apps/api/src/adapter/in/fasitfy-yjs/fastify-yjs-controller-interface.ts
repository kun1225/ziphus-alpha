import { YSocketIO } from 'y-socket.io/dist/server';
import type { Server, IncomingMessage, ServerResponse } from "node:http";
import type { FastifyBaseLogger, FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

type FastifyYJSControllerInterface<T> = (
  fastify: FastifyInstance<
    Server,
    IncomingMessage,
    ServerResponse,
    FastifyBaseLogger,
    ZodTypeProvider
  >,
  ySocketIO: YSocketIO,
  ...useCases: T[]
) => void;

export default FastifyYJSControllerInterface;
