import { PgAdapter } from "../../src/infra/database/PgAdapter";
import { UserDatabase } from "../../src/infra/database/repository/user";
import { CreateUser } from "../../src/core/domain/use_cases/user/create-user";
import { UpdateUser } from "../../src/core/domain/use_cases/user/update-user";
import { FindUser } from "../../src/core/domain/use_cases/user/find-user";
import { DeleteUser } from "../../src/core/domain/use_cases/user/delete-user";
import LoginAuthHistoryDatabase from "../../src/infra/database/repository/login-auth-history";
import { AuthUser } from "../../src/core/domain/use_cases/login/auth-user";
import { Token } from "../../src/core/domain/use_cases/token";
import { FindUserHistoryAuth } from "../../src/core/domain/use_cases/login/find-user-history-auth";
import { LoginHistoryAuthentication } from "../../src/core/domain/entities/login-authentication";
import { FindManyUser } from "../../src/core/domain/use_cases/user/find-many-user";
import { only } from "node:test";

describe("User", () => {
  let client: PgAdapter<UserDatabase | LoginAuthHistoryDatabase>;
  let userRepository: UserDatabase;
  let loginHistoryRepository: LoginAuthHistoryDatabase;

  const input = {
    email: `test@example.com`,
    password: `password`,
    username: "username",
  };

  beforeAll(async () => {
    client = new PgAdapter("postgresql://postgres:postgres@localhost:5432/postgres");
    userRepository = new UserDatabase(client);
    loginHistoryRepository = new LoginAuthHistoryDatabase(client);
    await client.connect();
  });

  const createUser = async () => {
    const createUserUseCase = new CreateUser(userRepository);
    return await createUserUseCase.execute(input);
  };
  beforeEach(async () => {
    jest.setTimeout(60000);
    await client.query('BEGIN');
  });

  afterEach(async () => {
    await client.query('ROLLBACK');
  });
  test("should create a new user", async () => {
    const newUser = await createUser();
    const findUserUseCase = new FindUser(userRepository);
    const user = await findUserUseCase.execute({ id: newUser.id });

    expect(user.email.value).toBe(input.email);
    expect(user.id).toBeDefined();
  });

  test("should return users", async () => {
    const findUserUseCase = new FindManyUser(userRepository);
    const user = await findUserUseCase.execute();

    expect(user[0].active).toBeTruthy()
    expect(user[0].email).toBeDefined()
    expect(user[0].id).toBeDefined()
    expect(user[0].username).toBeDefined()
  });
  
 test("should update a user", async () => {
    const newUser = await createUser();
    const updateUserUseCase = new UpdateUser(userRepository);
    await updateUserUseCase.execute({
      id: newUser.id,
      active: false,
      password: "update",
    });
    const findUserUseCase = new FindUser(userRepository);
    const user = await findUserUseCase.execute({ id: newUser.id });

    expect(user.password.validate("update")).toBeTruthy();
    expect(user.active).toBeFalsy();
  });

  test("should delete a user", async () => {
    const newUser = await createUser();
    const deleteUserUseCase = new DeleteUser(userRepository);
    await deleteUserUseCase.execute({ id: newUser.id });
    const findUserUseCase = new FindUser(userRepository);
    const response = await findUserUseCase.execute({ id: newUser.id })
    
     expect(response.active).toBeFalsy()
  });

  test("should authenticate a user", async () => {
    const newUser = await createUser();
    const authUserUseCase = new AuthUser(userRepository, loginHistoryRepository);
    const output = await authUserUseCase.execute({
      ...input,
      device: "device",
      ip: "ip",
      location: "location",
    });
    const usecaseAuthHistory = new FindUserHistoryAuth(loginHistoryRepository)
    const historyAuthUser  = await usecaseAuthHistory.execute({
      userId: newUser.id,
    })
    const isValid = Token.verify(output.token);
    
    expect(isValid).toBeTruthy();
    expect(historyAuthUser).toBeInstanceOf(Array<LoginHistoryAuthentication>)
  });

  test("should throw an error on authentication failure", async () => {
    const authUserUseCase = new AuthUser(userRepository, loginHistoryRepository);
    
    await expect(authUserUseCase.execute({
      ...input,
      password: "123",
      device: "device",
      ip: "ip",
      location: "location",
    })).rejects.toThrow("User test@example.com not authenticated");
  });

  beforeEach((): void => {
    jest.setTimeout(60000);
  });
});
