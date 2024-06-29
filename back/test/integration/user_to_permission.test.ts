import { CreatePermission } from "../../src/core/domain/use_cases/permission/create-permission";
import { CreateUser } from "../../src/core/domain/use_cases/user/create-user";
import { FindUser } from "../../src/core/domain/use_cases/user/find-user";
import { UpdateUser } from "../../src/core/domain/use_cases/user/update-user";
import { PgAdapter } from "../../src/infra/database/PgAdapter";
import { PermissionDatabase } from "../../src/infra/database/repository/permission";
import { UserDatabase } from "../../src/infra/database/repository/user";

describe("User to Permission", ()=>{
  let client: PgAdapter<UserDatabase | PermissionDatabase>;
  let userRepository: UserDatabase;
  let permissionRepository: PermissionDatabase;

  beforeAll(async () => {
    client = new PgAdapter("postgresql://postgres:postgres@localhost:5432/postgres");
    userRepository = new UserDatabase(client);
    permissionRepository = new PermissionDatabase(client);
    await client.connect();
  });
  const inputCreateUser = {
    email: `test@example.com`,
    password: `password`,
    username: "username",
  };

  const createUser = async () => {
    const createUserUseCase = new CreateUser(userRepository);
    return await createUserUseCase.execute(inputCreateUser);
  };
  test("verify user to permission defaults", async ()=>{
    const newUser = await createUser();
    const oldUser = await new FindUser(userRepository).execute({id: newUser.id});
    expect(oldUser.checkPermission(["CREATE_USER", "UPDATE_USER", "DELETE_USER", "FIND_USER", "FIND_MANY_USER" ])).toBeTruthy()
  })
  test("verify user to permission specific", async ()=>{
    const permission = new CreatePermission(permissionRepository)
    const newPermission = await permission.execute({
      name: "ADMIN_USER",
    })
    const newUser = await createUser();
    const user = new UpdateUser(userRepository)
    await user.execute({
      permissions: newPermission,
      id: newUser.id
    })
    const oldUser = await new FindUser(userRepository).execute({id: newUser.id});
    expect(oldUser.checkPermission(["ADMIN_USER" ])).toBeTruthy()
  })

  beforeEach((): void => {
    jest.setTimeout(60000);
  });
})