import { Permission } from '@prisma/client'
import { IPermissionRepository } from '../repository/iPermission'

export default class PermissionServices implements IPermissionRepository {
    constructor(private readonly repository: IPermissionRepository) {}
    async connectToRole({
        idPermission,
        nameRole,
    }: {
        idPermission: string
        nameRole: string
    }): Promise<void> {
        await this.repository.connectToRole({
            idPermission,
            nameRole,
        })
    }
    async save(input: Omit<Permission, 'id'>): Promise<any> {
        console.log(input)
        const output = await this.repository.save({
            name: input.name,
        })
        return output
    }

    async update(
        input: Partial<Omit<Permission, 'id'>> & { id: string }
    ): Promise<any> {
        const output = await this.repository.update({
            id: input.id,
            name: input.name,
        })
        return output
    }

    findByUnique(id: string): Promise<Permission> {
        throw new Error('Method not implemented.')
    }
    async find(input?: any): Promise<Permission[]> {
        const output = await this.repository.find()
        return output
    }
    async delete(id: string): Promise<boolean> {
        try {
            await this.repository.delete(id)
            return true
        } catch (error) {
            throw new Error(error)
        }
    }
}
