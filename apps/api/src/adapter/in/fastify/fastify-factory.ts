import Fastify from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import cors from "@fastify/cors";

function fastifyFactory(port: number = 8080) {
  const fastify = Fastify().withTypeProvider<ZodTypeProvider>();
  fastify.register(cors, {
    origin: ["*"],
    credentials: true,
  });
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  fastify.listen({ port }).then((address) => {
    console.log(`Server listening on ${address}`);
  });
  return fastify;
}

export default fastifyFactory;
