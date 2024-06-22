import { Prisma, UserAuthentication } from '@prisma/client'
import IBaseRepository from './iBaseRepository'

export interface UserAuthenticationWithInclude
    extends Prisma.UserAuthenticationFindFirstArgs {
    where: Prisma.UserAuthenticationWhereInput
}
export interface UserAuthenticationReturn
    extends Prisma.UserAuthenticationGetPayload<{
        include: {
            loginAudit: boolean
            passwordResetRequest: boolean
            permission: boolean
            role: {
                include: {
                    permission: true
                }
            }
        }
    }> {}

export interface IUserAuthenticationRepository
    extends IBaseRepository<UserAuthentication> {
    findByUnique(
        params: UserAuthenticationWithInclude
    ): Promise<UserAuthenticationReturn>
    save(input: UserAuthentication & Partial<{ id: string }>): Promise<any>
    deleteByPermission({
        userId,
        permission,
    }: {
        userId: string
        permission: string
    }): Promise<any>
    addingByPermission({
        userId,
        permission,
    }: {
        userId: string
        permission: string
    }): Promise<any>
    updateForRoleUser({
        userId,
        role,
    }: {
        userId: string
        role: string
    }): Promise<any>
}
