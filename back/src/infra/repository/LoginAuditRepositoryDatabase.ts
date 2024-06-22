import { PrismaClient, LoginAudit } from '@prisma/client'
import { ILoginAuditRepository } from '../../application/repository/iLoginAudit'

export default class LoginAuditRepositoryDatabase
    implements ILoginAuditRepository
{
    constructor(private readonly db: PrismaClient['loginAudit']) {}

    async save(input: Omit<LoginAudit, 'id'>): Promise<any> {
        const output = await this.db.create({
            data: {
                device: input.device,
                location: JSON.stringify(input.location) ?? 'Não localizado',
                ip: input.ip,
                success: input.success,
                user: {
                    connect: {
                        id: input.userAuthenticationId,
                    },
                },
                createdAt: new Date().toISOString(),
            },
        })
        return output
    }
    async update(
        input: Partial<Omit<LoginAudit, 'id'>> & { id: string }
    ): Promise<any> {
        throw new Error('Method not implements')
    }
    async findByUnique(where: Partial<LoginAudit>): Promise<LoginAudit> {
        const output = await this.db.findFirst({
            where: where,
        })
        return output
    }
    async find(input: any): Promise<LoginAudit[]> {
        return await this.db.findMany({
            where: input,
        })
    }
    async delete(id: string): Promise<any> {
        throw new Error('Method not implements')
    }
}
