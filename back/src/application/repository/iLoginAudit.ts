import { LoginAudit } from "@prisma/client";
import IBaseRepository from "./iBaseRepository";

export interface ILoginAuditRepository extends Omit<IBaseRepository<LoginAudit>, "update" | "delete"> { }