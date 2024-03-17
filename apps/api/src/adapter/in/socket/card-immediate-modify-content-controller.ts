import { CardContentModifyEventDTO, Authorization } from "@repo/shared-types";
import type { CardImmediateModifyContentUseCase } from "@/application/port/in/card-immediate-modify-content-use-case";
import type IoControllerInterface from "./io-controller-interface";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";

const CardImmediateModifyContentController: IoControllerInterface<
  CardImmediateModifyContentUseCase
> = (socket, io, cardImmediateModifyContent) => {
  socket.on(
    "card:modify-content",
    async (data: CardContentModifyEventDTO & Authorization) => {
      try {
        const accountToken = getAccountTokenInterfaceFromAuth(data);
        await cardImmediateModifyContent({
          accountId: accountToken?.accountId,
          ...data,
        });
        io.emit("card:modified-content", {
          ...data,
          authorization: undefined,
        });
      } catch (error) {}
    }
  );
};

export default CardImmediateModifyContentController;
