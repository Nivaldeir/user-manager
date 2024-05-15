import { Role } from "@prisma/client";
import IBaseRepository from "./iBaseRepository";

export interface IRoleRepository extends IBaseRepository<Role> {
    deleteByPermission({ roleId, permission }: { roleId: string, permission: string }): Promise<any>
    addingByPermission({ roleId, permission }: { roleId: string, permission: string }): Promise<any>
}