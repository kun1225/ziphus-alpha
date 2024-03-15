import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import accountRegisterUseCaseConstructor from "./application/domain/service/account-register-service";
import { type LoadAccountPort } from "@/application/port/out/load-account-port";
import { type SaveAccountPort } from "@/application/port/out/save-account-port";
import AccountPersistenceSaveAdapter from "@/adapter/out/persistence/account-persistence-save-adapter";
import AccountPersistenceLoadAdapter from "@/adapter/out/persistence/account-persistence-load-adapter";
import accountRegisterController from "@/adapter/in/fastify/account-register-controller";
import accountLoginWithEmailUseCaseConstructor from "@/application/domain/service/account-login-with-email-service";
import accountLoginWithEmailController from "@/adapter/in/fastify/account-login-with-email-controller";
import accountGetInfoUseCaseConstructor from "@/application/domain/service/account-get-info-service";
import accountMeController from "@/adapter/in/fastify/account-me-controller";

// 初始化 fastify
const fastify = Fastify().withTypeProvider<ZodTypeProvider>();
fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

// 初始化持久層
const loadAccount: LoadAccountPort = AccountPersistenceLoadAdapter;
const saveAccount: SaveAccountPort = AccountPersistenceSaveAdapter;

// 初始化 use case
const accountRegisterUseCase = accountRegisterUseCaseConstructor(
  loadAccount,
  saveAccount
);
const accountLoginWithEmailUseCase =
  accountLoginWithEmailUseCaseConstructor(loadAccount);
const accountGetInfoUseCase = accountGetInfoUseCaseConstructor(loadAccount);

// 註冊 controller
accountRegisterController(fastify, accountRegisterUseCase);
accountLoginWithEmailController(fastify, accountLoginWithEmailUseCase);
accountMeController(fastify, accountGetInfoUseCase);

fastify.listen({ port: 8080 }).then((address) => {
  console.log(`Server listening on ${address}`);
});
