import { IUserRepository } from "../../../core/application/repository/user-repository";
import { Email } from "../../../core/domain/entities/email";
import { Password } from "../../../core/domain/entities/password";
import { Permission } from "../../../core/domain/entities/permission";
import { User } from "../../../core/domain/entities/user";
import DatabaseConnection from "../DatabaseConnection";

export class UserDatabase implements IUserRepository {
    constructor(private readonly db: DatabaseConnection<User>) {}
    private async getPermission(userId: string):Promise<Permission[]> {
        const permissions = await this.db.query("SELECT p.id, p.name FROM permissions p JOIN user_permission up ON p.id = up.permission_id WHERE up.user_id = $1", [userId])
        return permissions.map((permission: any) => new Permission({
            id: permission.id,
            name: permission.name
        }))
    }
    async findById(id: string): Promise<User> {
        const [user] = await this.db.query('SELECT * FROM users WHERE id = $1', [id]);
        if (!user) {
            throw new Error('user not found');
        }
        const permissions = await this.getPermission(user.id)
        return new User({
            active: user.active,
            email: new Email(user.email),
            id: user.id,
            password: new Password(user.password_hash, user.password_salt),
            permissions: permissions,
            username: user.username,
        });
    }
    async findByEmail(email: string): Promise<User> {
       const [user] = await this.db.query('SELECT * FROM public.users WHERE email = $1', [email]) 
       if (!user) {
           throw new Error('user not found');
        }
        const permissions = await this.getPermission(user.id)
       return new User({
        active: user.active,
        email: new Email(user.email),
        id: user.id,
        password: new Password(user.password_hash, user.password_salt),
        permissions: permissions,
        username: user.username
       })
    }

    async create(data: User): Promise<User> {
        try {
            await this.db.query('BEGIN');
            const userValues = [data.id, data.username, data.email.value, data.password.value, data.password.salt, data.active];
            await this.db.query(`
                INSERT INTO public.users (id, username, email, password_hash, password_salt, active) 
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `, userValues);
            for (const permission of data.permissions) {
                const permissionQuery = `
                    INSERT INTO public.user_permission (user_id, permission_id)
                    VALUES ($1, $2)
                `;
                const permissionValues = [data.id, permission.id];
                const result = await this.db.query(permissionQuery, permissionValues);
            }
    
            await this.db.query('COMMIT');
            return data
        } catch (error) {
            await this.db.query('ROLLBACK');
            console.error('Error in create:', error);
            throw error;
        }
    }

    async update(data: User): Promise<void> {
        try {
            await this.db.query('BEGIN');
            await this.db.query(`
                INSERT INTO public.users (id, username, email, password_hash, password_salt, active) 
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (id) DO UPDATE 
                SET username = EXCLUDED.username, 
                email = EXCLUDED.email, 
                password_hash = EXCLUDED.password_hash, 
                password_salt = EXCLUDED.password_salt, 
                active = EXCLUDED.active
            `, [data.id, data.username, data.email.value, data.password.value, data.password.salt, data.active]);

                // await this.db.query(`
                //     DELETE FROM public.user_permission
                //     WHERE user_id = $1
                // `, [data.id]);

             if (data.permissions.length > 0) {
                const values = data.permissions.map((permissionId, index) => `($1, $${index + 2})`).join(', ');
                const params = [data.id, ...data.permissions.map((permission) => `${permission.id}`)];
    
                await this.db.query(`
                    INSERT INTO public.user_permission (user_id, permission_id)
                    VALUES ${values}
                    ON CONFLICT DO NOTHING
                `, params);
            }

            await this.db.query('COMMIT');
        } catch (error) {
            await this.db.query('ROLLBACK');
            console.error('Error in create:', error);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            // await this.db.query("DELETE FROM public.user_permission WHERE id_user = $1", [id]);
            await this.db.query("UPDATE public.users SET active = false WHERE id = $1", [id]);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    async findMany(): Promise<any> {
        try {
            const users = await this.db.query("SELECT * FROM public.users") as any
            return users.map((user: any) =>new User({
                active: user.active,
                email: new Email(user.email),
                id: user.id,
                password: new Password(user.password_hash, user.password_salt),
                permissions: [],
                username: user.username
            }))
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
