import { PgAdapter } from "../../src/infra/database/PgAdapter";
import { UserDatabase } from "../../src/infra/repository/user";
import { CreateUser } from "../../src/core/domain/use_cases/user/create-user";
import { User } from "../../src/core/domain/entities/user";
import { UpdateUser } from "../../src/core/domain/use_cases/user/update-user";
import { FindUser } from "../../src/core/domain/use_cases/user/find-user";
import { randomUUID } from "crypto";
import { DeleteUser } from "../../src/core/domain/use_cases/user/delete-user";

describe("User with testcontainer", () => {
  let client: PgAdapter<User>;
  const input = {
    email: `user${randomUUID()}@teste.com`,
    password: randomUUID()+`password${randomUUID()}`,
    username: "username",
  }
  let dbRepository: UserDatabase
  beforeAll(async () => {
    client = new PgAdapter("postgresql://postgres:postgres@localhost:5432/postgres");
    dbRepository = new UserDatabase(client)
    client.connect();
  });
  test("should create a new user", async () => {
    const userCreateRepository = new CreateUser(dbRepository);
    const userCreate = await userCreateRepository.execute(input);
    const userFindRepository = new FindUser(dbRepository);
    const user = await userFindRepository.execute({ id: userCreate.id });
    expect(user.email.value).toBe(input.email);
    expect(user.id).toBeDefined();
  });
  test("should update a user", async () => {
    const userCreateRepository = new CreateUser(dbRepository) 
    const userUpdateRepository = new UpdateUser(dbRepository) 
    const userCreate = await userCreateRepository.execute(input)
    await userUpdateRepository.execute({
      id: userCreate.id,
      active: false,
      password: "update"
    })
    const userFindRepository = new FindUser(dbRepository)
    const user = await userFindRepository.execute({id: userCreate.id})
    expect(()=>user.password.validate("update")).toBeTruthy()
    expect(user.active).toBeFalsy()
  });
  test("should delelte a user", async () => {
    const userCreateRepository = new CreateUser(dbRepository) 
    const userDeleteRepository = new DeleteUser(dbRepository) 
    const userCreate = await userCreateRepository.execute(input)
    await userDeleteRepository.execute({id:userCreate.id})
    const userFindRepository = new FindUser(dbRepository)
    expect(async ()=>await userFindRepository.execute({id: userCreate.id})).rejects.toThrow("user not found")
  });
});
