import { PrismaClient } from '@prisma/client'
import { IRoleRepository } from '../../application/repository/iRole'
import { ErrorHandler } from '../errors/PrismaError'

export class RoleRepositoryDatabase implements IRoleRepository {
    private readonly errorHandler: ErrorHandler
    constructor(private readonly db: PrismaClient['role']) {
        this.errorHandler = new ErrorHandler()
    }
    async deleteByPermission({
        roleId,
        permission,
    }: {
        roleId: string
        permission: string
    }): Promise<any> {
        try {
            return await this.db.update({
                where: {
                    id: roleId,
                },
                data: {
                    permission: {
                        disconnect: {
                            name: permission,
                        },
                    },
                },
            })
        } catch (error) {}
    }
    async addingByPermission({
        roleId,
        permission,
    }: {
        roleId: string
        permission: string
    }): Promise<any> {
        try {
            return await this.db.update({
                where: {
                    id: roleId,
                },
                data: {
                    permission: {
                        connect: {
                            name: permission,
                        },
                    },
                },
            })
        } catch (error) {}
    }
    async save(input: Omit<{ id: string; name: string }, 'id'>): Promise<any> {
        return await this.db.create({ data: input })
    }
    async update(
        input: Partial<Omit<{ id: string; name: string }, 'id'>> & {
            id: string
        }
    ): Promise<any> {
        return await this.db.update({ where: { id: input.id }, data: input })
    }
    async findByUnique(id: string): Promise<{ id: string; name: string }> {
        return await this.db.findUnique({
            where: { id: id },
            include: { permission: true },
        })
    }
    async find(input?: any): Promise<any[]> {
        return await this.db.findMany({
            include: {
                permission: true,
            },
        })
    }
    async delete(id: string): Promise<boolean> {
        try {
            await this.db.delete({
                where: {
                    id: id,
                    NOT: [
                        {
                            name: 'member',
                        },
                        {
                            name: 'admin',
                        },
                        {
                            userAuthentication: {
                                some: {
                                    roleId: id,
                                },
                            },
                        },
                    ],
                },
                include: { userAuthentication: true },
            })
            return true
        } catch (error) {
            return this.errorHandler.handle(error)
        }
    }
}
