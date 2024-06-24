import { LoginHistoryAuthentication } from "../../src/core/domain/entities/login-authentication"
import { CreateLoginAuth } from "../../src/core/domain/use_cases/login/create-login-auth"
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
  test("should create permission", async ()=>{
    const CreateUsecase = new CreateLoginAuth(dbAdapter)
    const output = await  CreateUsecase.execute({...input, userId:"a3f2399c-a5d1-49ba-a15c-93bad9c63647"})
    expect(output.device).toBe(input.device)
    expect(output.id).toBeDefined()
  })
})