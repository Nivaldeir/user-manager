import { IPermissionRepository } from "../../../application/repository/permission-repository";
import { Permission } from "../../entities/permission";

export class UpdatePermission {
  constructor(private readonly permissionRepository: IPermissionRepository){}
  async execute(input:Input){
    const permission = new Permission(input)
    return await this.permissionRepository.update(permission)
  }
}
type Input = {
  name:string;
  id:string
}