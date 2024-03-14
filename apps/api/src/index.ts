import Fastify from "fastify";
import accountRegisterUseCaseConstructor from "./application/domain/service/account-register-service";
import { type LoadAccountPort } from "@/application/port/out/load-account-port";
import { type SaveAccountPort } from "@/application/port/out/save-account-port";
import AccountPersistenceSaveAdapter from "@/adapter/out/persistence/account-persistence-save-adapter";
import AccountPersistenceLoadAdapter from "@/adapter/out/persistence/account-persistence-load-adapter";
import accountRegisterController from "@/adapter/in/fastify/account-register-controller";

// 初始化 fastify
const fastify = Fastify({
  logger: true,
});

// 初始化持久層
const loadAccount: LoadAccountPort = AccountPersistenceLoadAdapter;
const saveAccount: SaveAccountPort = AccountPersistenceSaveAdapter;

// 初始化 use case
const accountRegisterUseCase = accountRegisterUseCaseConstructor(
  loadAccount,
  saveAccount
);

// 註冊 controller
accountRegisterController(fastify, accountRegisterUseCase);

fastify.listen({ port: 8080 }).then((address) => {
  console.log(`Server listening on ${address}`);
});
