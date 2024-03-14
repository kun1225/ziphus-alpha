import { FastifyInstance } from "fastify";

interface FastifyControllerInterface<T> {
  (fastify: FastifyInstance, ...useCases: T[]): void;
}

export default FastifyControllerInterface;
