import { AuthUser } from "../../domain/use_cases/login/auth-user"
import { CreateLoginAuth } from "../../domain/use_cases/login/create-login-auth"
import { FindUserHistoryAuth } from "../../domain/use_cases/login/find-user-history-auth"
import { CreatePermission } from "../../domain/use_cases/permission/create-permission"
import { DeletePermission } from "../../domain/use_cases/permission/delete-permission"
import { UpdatePermission } from "../../domain/use_cases/permission/update-permission"
import { CreateUser } from "../../domain/use_cases/user/create-user"
import { DeleteUser } from "../../domain/use_cases/user/delete-user"
import { FindUser } from "../../domain/use_cases/user/find-user"
import { UpdateUser } from "../../domain/use_cases/user/update-user"
import { PgAdapter } from "../../../infra/database/PgAdapter"
import { UserDatabase } from "../../../infra/database/repository/user"
import { PermissionDatabase } from "../../../infra/database/repository/permission"
import LoginAuthHistoryDatabase from "../../../infra/database/repository/login-auth-history"
import { FindManyUser } from "../../domain/use_cases/user/find-many-user"
import { FindPermission } from "../../domain/use_cases/permission/find-permission"

export class CasesFactory {
  private static db = new PgAdapter("postgresql://postgres:postgres@localhost:5432/postgres")
  private static userRepositoryDatabase = new UserDatabase(this.db)
  private static permissionRepositoryDatabase = new PermissionDatabase(this.db)
  private static loginHistoryRepositoryDatabase = new LoginAuthHistoryDatabase(this.db)
  constructor(  
    readonly authUser: AuthUser,
    readonly createLoginAuth: CreateLoginAuth,
    readonly findUserHistoryAuth: FindUserHistoryAuth,
  
    readonly createPermissions: CreatePermission,
    readonly deletePermission: DeletePermission,
    readonly updatePermissions: UpdatePermission,
    readonly findPermissions: FindPermission,
  
    readonly createUser: CreateUser,
    readonly deleteUser: DeleteUser,
    readonly findUser: FindUser,
    readonly updateUser: UpdateUser,
    readonly findManyUsers: FindManyUser,
  ){}


  static create(): CasesFactory{
    const createPermissions = new CreatePermission(this.permissionRepositoryDatabase);
    const deletePermission = new DeletePermission(this.permissionRepositoryDatabase);
    const updatePermissions = new UpdatePermission(this.permissionRepositoryDatabase);
    const findPermission = new FindPermission(this.permissionRepositoryDatabase);

    const createUser = new CreateUser(this.userRepositoryDatabase);
    const deleteUser = new DeleteUser(this.userRepositoryDatabase);
    const findUser = new FindUser(this.userRepositoryDatabase);
    const updateUser = new UpdateUser(this.userRepositoryDatabase);
    const findManyUser = new FindManyUser(this.userRepositoryDatabase);

    const authUser = new AuthUser(this.userRepositoryDatabase, this.loginHistoryRepositoryDatabase);
    const createLoginAuth = new CreateLoginAuth(this.loginHistoryRepositoryDatabase);
    const findUserHistoryAuth = new FindUserHistoryAuth(this.loginHistoryRepositoryDatabase);

    return new CasesFactory(
      authUser,
      createLoginAuth,
      findUserHistoryAuth,
      createPermissions,
      deletePermission,
      updatePermissions,
      findPermission,
      createUser,
      deleteUser,
      findUser,
      updateUser,
      findManyUser,
    );
  }
}