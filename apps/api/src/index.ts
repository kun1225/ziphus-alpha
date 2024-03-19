import fastifyFactory from "@/adapter/in/fastify/fastify-factory";
import SocketIoFactory from "@/adapter/in/socket/socket-io-factory";
import YSocketIOFactory from "@/adapter/in/yjs/y-socket-io-factory";

import { type LoadAccountPort } from "@/application/port/out/load-account-port";
import { type SaveAccountPort } from "@/application/port/out/save-account-port";
import { type LoadCardListPort } from "@/application/port/out/load-card-list-port";
import { type LoadCardPort } from "@/application/port/out/load-card-port";
import { type SaveCardPort } from "@/application/port/out/save-card-port";
import { type DeleteCardPort } from "@/application/port/out/delete-card-port";

import AccountPersistenceSaveAdapter from "@/adapter/out/persistence/account-persistence-save-adapter";
import AccountPersistenceLoadAdapter from "@/adapter/out/persistence/account-persistence-load-adapter";
import CardListPersistenceLoadAdapter from "@/adapter/out/persistence/card-list-persistence-load-adapter";
import CardPersistenceLoadAdapter from "@/adapter/out/persistence/card-persistence-load-adapter";
import CardPersistenceSaveAdapter from "@/adapter/out/persistence/card-persistence-save-adapter";
import CardPersistenceDeleteAdapter from "@/adapter/out/persistence/card-persistence-delete-adapter";

import accountLoginWithEmailUseCaseConstructor from "@/application/domain/service/account-login-with-email-service";
import accountGetInfoUseCaseConstructor from "@/application/domain/service/account-get-info-service";
import accountRegisterUseCaseConstructor from "@/application/domain/service/account-register-service";
import cardCreateUseCaseConstructor from "@/application/domain/service/card-create-service";
import cardGetWithAllUseCaseConstructor from "@/application/domain/service/card-get-with-all-service";
import cardModifyContentUseCaseConstructor from "@/application/domain/service/card-modify-content-service";
import cardModifyTitleUseCaseConstructor from "@/application/domain/service/card-modify-title-service";
import cardGetByIdUseCaseConstructor from "@/application/domain/service/card-get-by-id-service";
import cardAccessEditValidatorUseCaseConstructor from "@/application/domain/service/card-access-edit-validator-service";
import cardModifyPermissionUseCaseConstructor from "@/application/domain/service/card-modify-permission-service";
import cardDeleteUseCaseConstructor from "@/application/domain/service/card-delete-service";

import accountRegisterController from "@/adapter/in/fastify/account-register-controller";
import accountLoginWithEmailController from "@/adapter/in/fastify/account-login-with-email-controller";
import accountMeController from "@/adapter/in/fastify/account-me-controller";
import cardCreateController from "@/adapter/in/fastify/card-create-controller";
import cardGetWithAllController from "@/adapter/in/fastify/card-get-with-all-controller";
import cardGetByIdController from "@/adapter/in/fastify/card-get-by-id-controller";
import cardModifyContentController from "@/adapter/in/fastify/card-modify-content-controller";
import cardModifyTitleController from "@/adapter/in/fastify/card-modify-title-controller";
import cardModifyPermissionController from "@/adapter/in/fastify/card-modify-permission-controller";
import cardDeleteController from "@/adapter/in/fastify/card-delete-controller";
import cardImmediateModifyContentController from "@/adapter/in/socket/card-immediate-modify-content-controller";
import YAuthenticateHandshakeConstructor from "@/adapter/in/yjs/y-authenticate-handshake";

// 初始化持久層
const loadAccount: LoadAccountPort = AccountPersistenceLoadAdapter;
const saveAccount: SaveAccountPort = AccountPersistenceSaveAdapter;
const loadCardList: LoadCardListPort = CardListPersistenceLoadAdapter;
const loadCard: LoadCardPort = CardPersistenceLoadAdapter;
const saveCard: SaveCardPort = CardPersistenceSaveAdapter;
const deleteCard: DeleteCardPort = CardPersistenceDeleteAdapter;

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
const cardModifyContentUseCase = cardModifyContentUseCaseConstructor(
  loadCard,
  saveCard
);
const cardModifyTitleUseCase = cardModifyTitleUseCaseConstructor(
  loadCard,
  saveCard
);
const cardModifyPermissionUseCase = cardModifyPermissionUseCaseConstructor(
  loadCard,
  saveCard
);
const cardAccessEditValidatorCase =
  cardAccessEditValidatorUseCaseConstructor(loadCard);
const cardDeleteUseCase = cardDeleteUseCaseConstructor(loadCard, deleteCard);

// 初始化基礎設施
const fastify = fastifyFactory(8080);
const io = SocketIoFactory(fastify);
YSocketIOFactory(
  io,
  YAuthenticateHandshakeConstructor(cardAccessEditValidatorCase)
);

// 註冊 controller
fastify.after(() => {
  accountRegisterController(fastify, accountRegisterUseCase);
  accountLoginWithEmailController(fastify, accountLoginWithEmailUseCase);
  accountMeController(fastify, accountGetInfoUseCase);
  cardCreateController(fastify, cardCreateUseCase);
  cardGetWithAllController(fastify, cardGetWithAllUseCase);
  cardGetByIdController(fastify, cardGetByIdUseCase);
  cardModifyContentController(fastify, cardModifyContentUseCase);
  cardModifyTitleController(fastify, cardModifyTitleUseCase);
  cardModifyPermissionController(fastify, cardModifyPermissionUseCase);
  cardDeleteController(fastify, cardDeleteUseCase);
});

fastify.ready((err) => {
  if (err) throw err;
  io.on("connection", (socket) => {
    cardImmediateModifyContentController(socket, [
      cardGetByIdUseCase,
      cardModifyContentUseCase,
    ]);
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
  fastify.swagger();
});
