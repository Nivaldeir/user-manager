import { PgAdapter } from "../../src/infra/database/PgAdapter";
import { UserDatabase } from "../../src/infra/repository/user";
import { CreateUser } from "../../src/core/domain/use_cases/user/create-user";
import { UpdateUser } from "../../src/core/domain/use_cases/user/update-user";
import { FindUser } from "../../src/core/domain/use_cases/user/find-user";
import { DeleteUser } from "../../src/core/domain/use_cases/user/delete-user";
import LoginAuthHistoryDatabase from "../../src/infra/repository/login-auth-history";
import { AuthUser } from "../../src/core/domain/use_cases/login/auth-user";
import { Token } from "../../src/core/domain/use_cases/token";

describe("User with testcontainer", () => {
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

  test("should create a new user", async () => {
    const newUser = await createUser();
    const findUserUseCase = new FindUser(userRepository);
    const user = await findUserUseCase.execute({ id: newUser.id });

    expect(user.email.value).toBe(input.email);
    expect(user.id).toBeDefined();
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
    await expect(findUserUseCase.execute({ id: newUser.id })).rejects.toThrow("user not found");
  });
 
  
  test("should authetication for user", async () => {
    await createUser();
    const authUserUseCase = new AuthUser(userRepository, loginHistoryRepository);
    const output = await authUserUseCase.execute(input);
    const isValid = Token.verify(output.token)

    expect(isValid).toBeTruthy()
  })
  test("should return erro am authetication for user", async () => {
    const authUserUseCase = new AuthUser(userRepository, loginHistoryRepository);
    
    await expect(authUserUseCase.execute({
      ...input,
      password: "123",
    })).rejects.toThrow("User test@example.com not authenticated");
  })

  beforeEach((): void => {
    jest.setTimeout(60000);
  });
});
