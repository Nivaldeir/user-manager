import { Permission } from "../../src/core/domain/entities/permission"
import { DeletePermission } from "../../src/core/domain/use_cases/permission/delete-permission"
import { CreatePermission } from "../../src/core/domain/use_cases/permission/create-permission"
import { UpdatePermission } from "../../src/core/domain/use_cases/permission/update-permission"
import { PgAdapter } from "../../src/infra/database/PgAdapter"
import { PermissionDatabase } from "../../src/infra/database/repository/permission"

describe("Permission", ()=>{
  let client: PgAdapter<Permission>
  let dbAdapter: PermissionDatabase
  const input = {
    name: "ADMIN"
  }
  beforeAll(async () => {
    client = new PgAdapter("postgresql://postgres:postgres@localhost:5432/postgres");
    dbAdapter = new PermissionDatabase(client)
    client.connect();
  });
  afterAll(async () =>{
    client.close()
  })
  test("should create permission", async ()=>{
    const permissionCreateUsecase = new CreatePermission(dbAdapter)
    const output = await  permissionCreateUsecase.execute(input)
    
    expect(output.name).toBe("ADMIN")
    expect(output.id).toBeDefined()
  })

  test("should update the permission", async ()=>{
    const permissionCreateUsecase = new CreatePermission(dbAdapter)
    const outputCreate = await  permissionCreateUsecase.execute(input)
    const permissionUpdateUsecase = new UpdatePermission(dbAdapter)
    const outputUpdate = await permissionUpdateUsecase.execute({
      id: outputCreate.id,
      name: "ADMIN_UPDATE"
    })

    expect(outputUpdate).toBeTruthy()
  })
  test("should delete the permission", async ()=>{
    const permissionCreateUsecase = new CreatePermission(dbAdapter)
    const outputCreate = await  permissionCreateUsecase.execute(input)
    const permissionUpdateUsecase = new DeletePermission(dbAdapter)
    const outputDelete = await permissionUpdateUsecase.execute({id: outputCreate.id})

    expect(outputDelete).toBeTruthy()
  })
})