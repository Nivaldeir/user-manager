import { LoginHistoryAuthentication } from "../../src/core/domain/entities/login-authentication"
import { CreateLoginAuth } from "../../src/core/domain/use_cases/login/create-login-auth"
import { FindUserHistoryAuth } from "../../src/core/domain/use_cases/login/find-user-history-auth"
import { PgAdapter } from "../../src/infra/database/PgAdapter"
import LoginAuthHistoryDatabase from "../../src/infra/repository/login-auth-history"

describe("Permission with testcontainer", ()=>{
  let client: PgAdapter<LoginHistoryAuthentication>
  let dbAdapter: LoginAuthHistoryDatabase
  const input = {
    ip: "127.0.0.1",
    device:"Brave",
    location: "SP"
  }
  beforeAll(async () => {
    client = new PgAdapter("postgresql://postgres:postgres@localhost:5432/postgres");
    dbAdapter = new LoginAuthHistoryDatabase(client)
    client.connect();
  });
  afterAll(async () =>{
    client.close()
  })
  test("should create login auth history", async ()=>{
    const CreateUsecase = new CreateLoginAuth(dbAdapter)
    const output = await  CreateUsecase.execute({...input, userId: "ca7ac207-999a-4ac6-9b64-13406645a3c7"})
    expect(output.device).toBe(input.device)
    expect(output.id).toBeDefined()
  })
  test("should find login auth history for user", async ()=>{
    const CreateUsecase = new CreateLoginAuth(dbAdapter)
    const outputAuth = await  CreateUsecase.execute({...input, userId: "ca7ac207-999a-4ac6-9b64-13406645a3c7"})
    const findUserCase = new FindUserHistoryAuth(dbAdapter);
    const output = await findUserCase.execute({ userId: outputAuth.id })
    expect(output).toBeInstanceOf(Array<LoginHistoryAuthentication>)
  })
})