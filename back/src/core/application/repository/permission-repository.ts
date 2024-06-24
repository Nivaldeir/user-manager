import { Permission } from "../../domain/entities/permission"

export interface IPermissionRepository {
  create(data: Permission): Promise<Permission>
  update(data: Permission): Promise<boolean>
  delete(id: string): Promise<boolean>
  findById(id: string): Promise<Permission>
}