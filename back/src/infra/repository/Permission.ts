import { PrismaClient } from "@prisma/client";
import { IPermissionRepository } from "../../application/repository/iPermission";
import { ErrorHandler } from "../errors/PrismaError";

export class PermissionRepositoryDatabase implements IPermissionRepository {
  private readonly errorHandler: ErrorHandler
  constructor(private readonly db: PrismaClient["permission"]) {
    this.errorHandler = new ErrorHandler()
  }
  async connectToRole({
    idPermission,
    nameRole,
  }: {
    idPermission: string;
    nameRole: string;
  }): Promise<void> {
    await this.db.update({
      where: {
        id: idPermission,
      },
      data: {
        role: {
          connect: {
            name: nameRole,
          },
        },
      },
    });
  }
  async findByUnique(id: string): Promise<{ id: string; name: string }> {
    return await this.db.findUnique({ where: { id } });
  }
  async find(input?: { id: string }): Promise<{ id: string; name: string }[]> {
    return await this.db.findMany();
  }
  async delete(id: string): Promise<boolean> {
    try {
      const permission = await this.db.findUnique({
        where: {
          id: id
        },
        include: { role: true }
      });

      const hasUserAuthenticationRole = permission.role.some(role => role.name);
      if (hasUserAuthenticationRole) {
        throw new Error("Existe usuario/cargo com esta permissão")
      }
      await this.db.delete({
        where: { id: id }
      });
    } catch (error) {
      return this.errorHandler.handle(error);
    }
  }

  async save(input: Omit<{ id: string; name: string }, "id">): Promise<any> {
    const output = await this.db.create({
      data: input,
    });
    return output;
  }
  async update(
    input: Partial<Omit<{ id: string; name: string }, "id">> & { id: string }
  ): Promise<any> {
    const output = await this.db.update({
      where: { id: input.id },
      data: input,
    });
    return output;
  }
}
