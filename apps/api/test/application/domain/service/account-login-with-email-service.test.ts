import Account from "@/application/domain/model/account";
import accountLoginWithEmailUseCaseConstructor from "@/application/domain/service/account-login-with-email-service";
import { type AccountLoginWithEmailUseCaseConstructor } from "@/application/port/in/account-login-with-email-use-case";
import { LoadAccountPort } from "@/application/port/out/load-account-port";
import { SaveAccountPort } from "@/application/port/out/save-account-port";
import hash from "@/common/hash";
import { randomUUID } from "crypto";
import { decodeToken } from "@/common/jwt-token";

describe("AccountLoginWithEmailUseCase", () => {
  let accountLoginWithEmailUseCase: ReturnType<AccountLoginWithEmailUseCaseConstructor>;
  let loadAccountMock: jest.Mock<ReturnType<LoadAccountPort>>;
  let saveAccountMock: jest.Mock<ReturnType<SaveAccountPort>>;

  beforeEach(() => {
    loadAccountMock = jest.fn();
    saveAccountMock = jest.fn();
    accountLoginWithEmailUseCase = accountLoginWithEmailUseCaseConstructor(
      loadAccountMock,
      saveAccountMock
    );
  });

  it("正常登入時，應該回傳登入 token", async () => {
    const email = "test@example.com";
    const password = "test-password";
    const hashedPassword = await hash(password);
    const existingAccount = new Account(
      randomUUID(),
      null,
      email,
      "Test User",
      hashedPassword,
      new Date().toISOString(),
      new Date().toISOString(),
      null
    );
    loadAccountMock.mockResolvedValueOnce(existingAccount);
    saveAccountMock.mockResolvedValueOnce(undefined);

    const loginToken = await accountLoginWithEmailUseCase({
      email,
      password,
    });
    const decodedToken = decodeToken(loginToken);

    expect(loginToken).toEqual(expect.any(String));
    expect(decodedToken).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        accountId: existingAccount.id,
        name: existingAccount.name,
        email: existingAccount.email,
      })
    );
  });

  it("密碼錯誤時，應該拋出錯誤", async () => {
    const email = "test@example.com";
    const password = "test-password";
    const hashedPassword = await hash(password);
    const existingAccount = new Account(
      randomUUID(),
      null,
      email,
      "Test User",
      hashedPassword,
      new Date().toISOString(),
      new Date().toISOString(),
      null
    );
    loadAccountMock.mockResolvedValueOnce(existingAccount);
    saveAccountMock.mockResolvedValueOnce(undefined);

    await expect(
      accountLoginWithEmailUseCase({
        email,
        password: "wrong-password",
      })
    ).rejects.toThrow("Invalid password");
  });

  it("帳號不存在時，應該拋出錯誤", async () => {
    loadAccountMock.mockResolvedValueOnce(null);
    saveAccountMock.mockResolvedValueOnce(undefined);

    await expect(
      accountLoginWithEmailUseCase({
        email: "test@example.com",
        password: "wrong-password",
      })
    ).rejects.toThrow("Account not found");
  });
});
