import { IPermissionRepository } from "../../../application/repository/permission-repository";

export class FindPermission {
  constructor(private readonly permissionRepository: IPermissionRepository){}
  async execute(input:Input){
    return await this.permissionRepository.findById(input.id)
  }
}

type Input = {
  id: string;
}