import { IPermissionRepository } from "../../../application/repository/permission-repository";
import { Permission } from "../../entities/permission";

export class CreatePermission {
  constructor(private readonly permissionRepository: IPermissionRepository){}
  async execute(input:Input){
    const permission = Permission.create(input.name)
    return await this.permissionRepository.create(permission)
  }
}
type Input = {
  name:string;
}