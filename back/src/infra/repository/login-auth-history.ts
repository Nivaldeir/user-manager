import { ILoginAuthHistoryRepository } from '../../core/application/repository/login-auth-history'
import DatabaseConnection from '../database/DatabaseConnection'
import { LoginHistoryAuthentication } from '../../core/domain/entities/login-authentication'

export default class LoginAuthHistoryDatabase
    implements ILoginAuthHistoryRepository
{
    constructor(private readonly db: DatabaseConnection<LoginHistoryAuthentication>) {}
    async findBy(params: any): Promise<LoginHistoryAuthentication[]> {
        const user = await this.db.query("SELECT * FROM public.login_auth WHERE id = $1",[params.id]) as any
        console.log(user)
        if(!user){
            return [] as any
        }
        return user.map((u: any)=> new LoginHistoryAuthentication({
            device: u.device,
            id: u.id,
            ip: u.ip,
            location: u.location,
            userId: u.userId,
            success: u.success
        }))
    }
    async create(data: LoginHistoryAuthentication): Promise<LoginHistoryAuthentication> {
        try {
            await this.db.query("INSERT INTO public.login_auth (id, user_id, ip, device, location, success) VALUES ($1, $2, $3, $4, $5, $6)", [data.id, data.userId, data.ip, data.device, data.location, true])
            return data;
        } catch (error) {
            await this.db.query("INSERT INTO public.login_auth (id, user_id, ip, device, location, success)")
            throw error
        }
    }
}
