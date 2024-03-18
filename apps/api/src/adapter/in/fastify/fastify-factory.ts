import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import {
  jsonSchemaTransform,
  createJsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

function fastifyFactory(port: number = 8080) {
  const fastify = Fastify();
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);
  fastify.register(cors, {
    origin: ["*"],
    credentials: true,
  });
  fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: "SampleApi",
        description: "Sample backend service",
        version: "1.0.0",
      },
      servers: [],
    },
    transform: jsonSchemaTransform,
  });
  fastify.register(fastifySwaggerUI, {
    routePrefix: "/documentation",
  });

  fastify.listen({ port }).then((address) => {
    console.log(`Server listening on ${address}`);
  });

  return fastify.withTypeProvider<ZodTypeProvider>();
}

export default fastifyFactory;
