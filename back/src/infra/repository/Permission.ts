import { IPermissionRepository } from '../../core/application/repository/permission-repository'
import { Permission } from '../../core/domain/entities/permission'
import DatabaseConnection from '../database/DatabaseConnection';
import { PgAdapter } from '../database/PgAdapter';

export class PermissionDatabase implements IPermissionRepository {
    constructor(private readonly db: DatabaseConnection<Permission>) {}
    findById(id: string): Promise<Permission> {
        throw new Error('Method not implemented.');
    }

    async create(data: Permission): Promise<Permission> {
        try {
            await this.db.query(
                "INSERT INTO public.permissions (id, name) VALUES ($1, $2)",
                [data.id, data.name]
            );
            return data
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    async update(data: Permission): Promise<boolean> {
        try {
            await this.db.query("UPDATE public.permissions SET name = $2 WHERE id = $1",[data.id, data.name])
            return true
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    async delete(id: string): Promise<boolean> {
        try {
            await this.db.query("DELETE FROM public.permissions WHERE id = $1", [id]);
            return true;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
