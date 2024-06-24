import { LoginHistoryAuthentication } from "../../domain/entities/login-authentication";

export interface ILoginAuthHistoryRepository {
  create(data: LoginHistoryAuthentication): Promise<LoginHistoryAuthentication>
  findBy(params: any): Promise<LoginHistoryAuthentication[]>
}