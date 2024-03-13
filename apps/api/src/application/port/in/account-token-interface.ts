class AccountTokenInterface {
  constructor(
    readonly id: string,
    readonly accountId: string,
    readonly name: string,
    readonly email: string
  ) {}
}

export default AccountTokenInterface;
