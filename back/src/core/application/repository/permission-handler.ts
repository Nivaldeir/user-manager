import { Permission } from "../../domain/entities/permission";

export abstract class PermissionHandler {
  abstract addPermission(permission: Permission): void;
  abstract removePermission(permission: Permission): void;
  abstract checkPermission(authorizationCode: string | string[]): boolean;
}