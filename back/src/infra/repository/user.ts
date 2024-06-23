import { IUserRepository } from "../../core/application/repository/user-repository";
import { Email } from "../../core/domain/entities/email";
import { Password } from "../../core/domain/entities/password";
import { User } from "../../core/domain/entities/user";
import { PgAdapter } from "../database/PgAdapter";

export class UserDatabase implements IUserRepository {
    constructor(private readonly db: PgAdapter<User>) {}

    async create(data: User): Promise<User> {
        try {
            await this.db.rollback(async e=>{
                await e.query(
                    "INSERT INTO public.users (id, username, email, password_hash, password_salt, active) VALUES ($1, $2, $3, $4, $5, $6)",
                    [data.id, data.username, data.email.value, data.password.value, data.password.salt, true]
                );
    
                // await Promise.all(data.permissions.map((permission) => {
                //     return e.query(
                //         "INSERT INTO public.user_permission (id_user, permission_id) VALUES ($1, $2)",
                //         [data.id, permission.id]
                //     );
                // }));
            })
            return data
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async update(data: User): Promise<void> {
        try {
            await this.db.rollback(async e=>{
                await e.query(
                    "UPDATE public.users SET username = $2, email = $3, password_hash = $4, password_salt = $5, active = $6 WHERE id = $1",
                    [data.id, data.username, data.email.value, data.password.value, data.password.salt, data.active]
                );
                // await Promise.all(data.permissions.map((permission) => {
                //     return e.query(
                //         "INSERT INTO public.user_permission (id_user, permission_id) VALUES ($1, $2)",
                //         [data.id, permission.id]
                //     );
                // }));
            })
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            // await this.db.query("DELETE FROM public.user_permission WHERE id_user = $1", [id]);
            await this.db.query("DELETE FROM public.users WHERE id = $1", [id]);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    async findBy(id: any): Promise<User> {
        try {
            const [user] = await this.db.query("SELECT * FROM public.users where id = $1", [id]) as any
            return new User({
                id: user.id,
                username: user.username,
                email: new Email(user.email),
                password: new Password(user.password_hash, user.password_salt),
                active:user.active,
                permissions:[]
            });
        } catch (error) {
            throw new Error("user not found");
        }
    }
    async findMany(): Promise<any> {
        try {
            return await this.db.query("SELECT * FROM public.users") as any
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
