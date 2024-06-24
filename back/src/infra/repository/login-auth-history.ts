import { ILoginAuthHistoryRepository } from '../../core/application/repository/login-auth-history'
import DatabaseConnection from '../database/DatabaseConnection'
import { LoginHistoryAuthentication } from '../../core/domain/entities/login-authentication'

export default class LoginAuthHistoryDatabase
    implements ILoginAuthHistoryRepository
{
    constructor(private readonly db: DatabaseConnection<LoginHistoryAuthentication>) {}
    findBy(params: any): Promise<LoginHistoryAuthentication[]> {
        throw new Error('Method not implemented.');
    }
    async create(data: LoginHistoryAuthentication): Promise<LoginHistoryAuthentication> {
        try {
            await this.db.query("INSERT INTO public.login_auth (id, user_id, ip, device, location, success) VALUES ($1, $2, $3, $4, $5, $6)", [data.id, data.userId, data.ip, data.device, data.location, true])
            return data;
        } catch (error) {
            await this.db.query("INSERT INTO public.login_auth (id, user_id, ip, device, location, success)",[])
            throw error
        }
    }
}
