import { Prisma, PrismaClient, UserAuthentication } from '@prisma/client'
import {
    IUserAuthenticationRepository,
    UserAuthenticationWithInclude,
} from '../../application/repository/iUserAuthentication'
import { DefaultArgs } from '@prisma/client/runtime/library'
import { ErrorHandler } from '../errors/PrismaError'

export default class UserAuthenticationDatabase
    implements IUserAuthenticationRepository
{
    private readonly errorHandler: ErrorHandler
    constructor(
        private readonly db: Prisma.UserAuthenticationDelegate<DefaultArgs>
    ) {
        this.errorHandler = new ErrorHandler()
    }

    async findByUnique(params: UserAuthenticationWithInclude): Promise<any> {
        try {
            const output = await this.db.findFirst(params)
            return output
        } catch (error) {
            return this.errorHandler.handle(error)
        }
    }
    async deleteByPermission({
        userId,
        permission,
    }: {
        userId: string
        permission: string
    }): Promise<any> {
        try {
            const user = await this.db.findUnique({
                where: {
                    id: userId,
                },
                include: {
                    role: {
                        include: {
                            permission: true,
                        },
                    },
                },
            })
            if (user.role.permission.find((e) => e.name === permission)) {
                throw new Error('Permisão incluso em seu cargo')
            }
            return await this.db.update({
                where: {
                    id: userId,
                },
                data: {
                    permission: {
                        disconnect: {
                            name: permission,
                        },
                    },
                },
            })
        } catch (error) {
            return this.errorHandler.handle(error)
        }
    }
    async updateForRoleUser({
        userId,
        role,
    }: {
        userId: string
        role: string
    }) {
        try {
            console.log(role)
            return await this.db.update({
                where: {
                    id: userId,
                },
                data: {
                    role: {
                        connect: {
                            name: role,
                        },
                    },
                },
            })
        } catch (error) {
            console.log(error)
            return this.errorHandler.handle(error)
        }
    }

    async addingByPermission({
        userId,
        permission,
    }: {
        userId: string
        permission: string
    }): Promise<any> {
        try {
            return await this.db.update({
                where: {
                    id: userId,
                },
                data: {
                    permission: {
                        connect: {
                            name: permission,
                        },
                    },
                },
            })
        } catch (error) {
            return this.errorHandler.handle(error)
        }
    }

    async save(input: UserAuthentication & { role: string }): Promise<any> {
        try {
            const output = await this.db.create({
                data: {
                    email: input.email,
                    password: input.password,
                    salt: input.salt,
                    enabled: true,
                    username: input.username,
                    role: {
                        connect: {
                            name: 'member',
                        },
                    },
                },
            })
            return output
        } catch (error) {
            return this.errorHandler.handle(error)
        }
    }
    async update(
        input: Partial<Omit<UserAuthentication, 'id'>> & { id: string }
    ): Promise<any> {
        try {
            const output = await this.db.update({
                where: { id: input.id },
                data: {
                    ...input,
                },
            })
            return output
        } catch (error) {
            return this.errorHandler.handle(error)
        }
    }
    async findById(id: string): Promise<UserAuthentication> {
        try {
            const output = await this.db.findFirst({
                where: { id: id },
            })
            return output
        } catch (error) {
            return this.errorHandler.handle(error)
        }
    }
    async find(input?: any): Promise<UserAuthentication[]> {
        try {
            if (!input) {
                return await this.db.findMany()
            }
            const { permission, loginAudit, ...rest } = input
            const output = await this.db.findMany({
                where: {
                    username: rest.username,
                    email: rest.email,
                },
                include: {
                    loginAudit: loginAudit,
                    permission: true,
                    role: {
                        include: {
                            permission: true,
                        },
                    },
                },
            })
            let userPermissions = output.map((user) => {
                let permissions = [
                    ...user.permission.map((permission) => permission.name),
                    ...user.role.permission.map(
                        (permission) => permission.name
                    ),
                ]
                return {
                    ...user,
                    role: user.role.name,
                    permission: permissions,
                }
            })
            return userPermissions
        } catch (error) {
            return this.errorHandler.handle(error)
        }
    }
    async delete(id: string): Promise<any> {
        try {
            await this.db.delete({
                where: { id: id },
            })
        } catch (error) {
            return this.errorHandler.handle(error)
        }
    }
}
