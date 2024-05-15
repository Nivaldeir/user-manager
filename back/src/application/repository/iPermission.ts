import { Permission } from "@prisma/client";
import IBaseRepository from "./iBaseRepository";

export interface IPermissionRepository extends IBaseRepository<Permission> {
  connectToRole({
    idPermission,
    nameRole,
  }: {
    idPermission: string;
    nameRole: string;
  }): Promise<void>;
}
