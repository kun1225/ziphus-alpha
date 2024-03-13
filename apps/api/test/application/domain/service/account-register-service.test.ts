import Account from "@/application/domain/model/account";
import accountRegisterUseCaseConstructor from "@/application/domain/service/account-register-service";
import { type AccountRegisterUseCaseConstructor } from "@/application/port/in/account-register-use-case";
import { LoadAccountPort } from "@/application/port/out/load-account-port";
import { SaveAccountPort } from "@/application/port/out/save-account-port";
import { randomUUID } from "crypto";

describe("AccountRegisterUseCase", () => {
  let accountRegisterUseCase: ReturnType<AccountRegisterUseCaseConstructor>;
  let loadAccountMock: jest.Mock<ReturnType<LoadAccountPort>>;
  let saveAccountMock: jest.Mock<ReturnType<SaveAccountPort>>;

  beforeEach(() => {
    loadAccountMock = jest.fn();
    saveAccountMock = jest.fn();
    accountRegisterUseCase = accountRegisterUseCaseConstructor(
      loadAccountMock,
      saveAccountMock
    );
  });

  it("當已有相同帳號時，應該拋出錯誤", async () => {
    const existingAccount = new Account(
      randomUUID(),
      null,
      "test@example.com",
      "Test User",
      "hashedPassword",
      new Date().toISOString(),
      new Date().toISOString(),
      null
    );
    loadAccountMock.mockResolvedValueOnce(existingAccount);

    await expect(
      accountRegisterUseCase({
        googleId: null,
        email: "test@example.com",
        name: "Test User",
        password: "password",
      })
    ).rejects.toThrow("Account already exists");
  });

  it("正常登入時，應該建立新帳號並回傳登入 token", async () => {
    loadAccountMock.mockResolvedValueOnce(null);
    saveAccountMock.mockResolvedValueOnce(undefined);

    const loginToken = await accountRegisterUseCase({
      googleId: null,
      email: "test@example.com",
      name: "Test User",
      password: "password",
    });

    expect(loadAccountMock).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(saveAccountMock).toHaveBeenCalledWith(
      expect.objectContaining({
        googleId: null,
        email: "test@example.com",
        name: "Test User",
      })
    );
    expect(loginToken).toBeDefined();
  });
});
