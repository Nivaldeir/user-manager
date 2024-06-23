import { IPermissionRepository } from "../../../application/repository/permission-repository";

export class DeletePermission {
  constructor(private readonly permissionRepository: IPermissionRepository){}
  async execute(input:Input){
    return await this.permissionRepository.delete(input.id)
  }
}
type Input = {
  id:string
}