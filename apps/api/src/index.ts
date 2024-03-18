import fastifyFactory from "@/adapter/in/fastify/fastify-factory";
import { type LoadAccountPort } from "@/application/port/out/load-account-port";
import { type SaveAccountPort } from "@/application/port/out/save-account-port";
import { type LoadCardListPort } from "@/application/port/out/load-card-list-port";
import { type LoadCardPort } from "@/application/port/out/load-card-port";
import { type SaveCardPort } from "@/application/port/out/save-card-port";

import AccountPersistenceSaveAdapter from "@/adapter/out/persistence/account-persistence-save-adapter";
import AccountPersistenceLoadAdapter from "@/adapter/out/persistence/account-persistence-load-adapter";
import CardListPersistenceLoadAdapter from "@/adapter/out/persistence/card-list-persistence-load-adapter";
import CardPersistenceLoadAdapter from "@/adapter/out/persistence/card-persistence-load-adapter";
import CardPersistenceSaveAdapter from "@/adapter/out/persistence/card-persistence-save-adapter";
import CreateSocketEmitAdapter from "@/adapter/out/io/emit-socket-adapter";

import accountLoginWithEmailUseCaseConstructor from "@/application/domain/service/account-login-with-email-service";
import accountGetInfoUseCaseConstructor from "@/application/domain/service/account-get-info-service";
import accountRegisterUseCaseConstructor from "@/application/domain/service/account-register-service";
import cardCreateUseCaseConstructor from "@/application/domain/service/card-create-service";
import cardGetWithAllUseCaseConstructor from "@/application/domain/service/card-get-with-all-service";

import accountRegisterController from "@/adapter/in/fastify/account-register-controller";
import accountLoginWithEmailController from "@/adapter/in/fastify/account-login-with-email-controller";
import accountMeController from "@/adapter/in/fastify/account-me-controller";
import cardCreateController from "@/adapter/in/fastify/card-create-controller";
import cardGetWithAllController from "@/adapter/in/fastify/card-get-with-all-controller";
import cardGetByIdController from "@/adapter/in/fastify/card-get-by-id-controller";
import cardGetByIdUseCaseConstructor from "@/application/domain/service/card-get-by-id-service";
import SocketIoFactory from "@/adapter/in/socket/socket-io-factory";
import CardModifyContentController from "@/adapter/in/yjs/card-modify-content-controller";
import cardModifyContentCaseConstructor from "@/application/domain/service/card-modify-content-service";
import { YSocketIO } from "y-socket.io/dist/server";
import cardStartEditSingleCardController from "./adapter/in/yjs/card-start-edit-single-card-controller";

// 初始化基礎設施
const fastify = fastifyFactory(8080);
const io = SocketIoFactory(fastify);
const ysocketio = new YSocketIO(io, {});
ysocketio.initialize();

// 初始化持久層
const loadAccount: LoadAccountPort = AccountPersistenceLoadAdapter;
const saveAccount: SaveAccountPort = AccountPersistenceSaveAdapter;
const loadCardList: LoadCardListPort = CardListPersistenceLoadAdapter;
const loadCard: LoadCardPort = CardPersistenceLoadAdapter;
const saveCard: SaveCardPort = CardPersistenceSaveAdapter;
const emitSocketAdapter = CreateSocketEmitAdapter(io);

// 初始化 use case
const accountRegisterUseCase = accountRegisterUseCaseConstructor(
  loadAccount,
  saveAccount
);
const accountLoginWithEmailUseCase =
  accountLoginWithEmailUseCaseConstructor(loadAccount);
const accountGetInfoUseCase = accountGetInfoUseCaseConstructor(loadAccount);
const cardCreateUseCase = cardCreateUseCaseConstructor(loadAccount, saveCard);
const cardGetWithAllUseCase = cardGetWithAllUseCaseConstructor(loadCardList);
const cardGetByIdUseCase = cardGetByIdUseCaseConstructor(loadCard);
const cardModifyContentUseCase = cardModifyContentCaseConstructor(
  loadCard,
  saveCard
);

// 註冊 controller
accountRegisterController(fastify, accountRegisterUseCase);
accountLoginWithEmailController(fastify, accountLoginWithEmailUseCase);
accountMeController(fastify, accountGetInfoUseCase);
cardCreateController(fastify, cardCreateUseCase);
cardGetWithAllController(fastify, cardGetWithAllUseCase);
cardGetByIdController(fastify, cardGetByIdUseCase);
CardModifyContentController(ysocketio, cardModifyContentUseCase);
cardStartEditSingleCardController(ysocketio, cardGetByIdUseCase);

fastify.ready((err) => {
  if (err) throw err;
  io.on("connection", (socket) => {
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
});
