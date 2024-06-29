import { randomUUID } from "crypto"
import { LoginHistoryAuthentication } from "../../src/core/domain/entities/login-authentication"
import { CreateLoginAuth } from "../../src/core/domain/use_cases/login/create-login-auth"
import { FindUserHistoryAuth } from "../../src/core/domain/use_cases/login/find-user-history-auth"
import { PgAdapter } from "../../src/infra/database/PgAdapter"
import LoginAuthHistoryDatabase from "../../src/infra/database/repository/login-auth-history"
import { CreateUser } from "../../src/core/domain/use_cases/user/create-user"
import { UserDatabase } from "../../src/infra/database/repository/user"

describe("Login Auth History", ()=>{
  let client: PgAdapter<LoginHistoryAuthentication>
  let dbAdapter: LoginAuthHistoryDatabase
  let userRepository: UserDatabase;
  const input = {
    ip: "127.0.0.1",
    device:"Brave",
    location: "SP"
  }

  const inputCreateUser = {
    email: `${randomUUID()}@example.com`,
    password: `password`,
    username: randomUUID()+"@username",
  };
  const createUser = async () => {
    const createUserUseCase = new CreateUser(userRepository);
    return await createUserUseCase.execute(inputCreateUser);
  };
  beforeAll(async () => {
    client = new PgAdapter("postgresql://postgres:postgres@localhost:5432/postgres");
    dbAdapter = new LoginAuthHistoryDatabase(client)
    userRepository = new UserDatabase(client);
    client.connect();
  });

  beforeEach(async () => {
    jest.setTimeout(60000);
    await client.query('BEGIN');
  });
  afterAll(async () =>{
    client.close()
  })
  afterEach(async () => {
    await client.query('ROLLBACK');
  });
  test("should create login auth history", async ()=>{
    const newUser = await createUser()
    const CreateUsecase = new CreateLoginAuth(dbAdapter)
    const output = await  CreateUsecase.execute({...input, userId: newUser.id})
    expect(output.device).toBe(input.device)
    expect(output.id).toBeDefined()
  })
  test("should find login auth history for user", async ()=>{
    const newUser = await createUser()
    const CreateUsecase = new CreateLoginAuth(dbAdapter)
    const outputAuth = await  CreateUsecase.execute({...input,  userId: newUser.id})
    const findUserCase = new FindUserHistoryAuth(dbAdapter);
    const output = await findUserCase.execute({ userId: outputAuth.id })
    expect(output).toBeInstanceOf(Array<LoginHistoryAuthentication>)
  })
  beforeEach((): void => {
    jest.setTimeout(60000);
  });
})