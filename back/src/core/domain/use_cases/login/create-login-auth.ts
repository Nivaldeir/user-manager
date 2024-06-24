import { ILoginAuthHistoryRepository } from "../../../application/repository/login-auth-history";
import { LoginHistoryAuthentication } from "../../entities/login-authentication";

export class CreateLoginAuth {
  constructor(private readonly loginRepository: ILoginAuthHistoryRepository){}
  async execute(input: Input){
    const loginHistory = LoginHistoryAuthentication.create({
      device: input.device,
      ip: input.ip,
      location: input.location,
      userId: input.userId
    })
    const output = await this.loginRepository.create(loginHistory)
    return output
  }
}
type Input = {
  ip: string;
  device: string;
  location: string;
  userId: string;
}