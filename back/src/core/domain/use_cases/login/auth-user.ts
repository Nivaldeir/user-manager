import { ILoginAuthHistoryRepository } from "../../../application/repository/login-auth-history";
import { IUserRepository } from "../../../application/repository/user-repository";
import { LoginHistoryAuthentication } from "../../entities/login-authentication";
import { Token } from "../token";

export class AuthUser {
  constructor(private readonly userRepository:IUserRepository, private readonly loginHistory: ILoginAuthHistoryRepository){}
  async execute(input: Input){
    const user = await this.userRepository.findByEmail(input.email)
    if(!user) throw new Error(`User ${input.email} not found`)
    const loginHistory =  LoginHistoryAuthentication.create({
      device: input.device,
      ip: input.ip,
      location: input.location,
      userId: user.id,
    })
    try {
      if(user.password.validate(input.password)){
        const token = Token.generate({
          id: user.id,
          email: user.email.value,
          active:user.active
        })
        loginHistory.success = true
        let userDto = {
          username: user.username,
          active: user.active,
          id: user.id,
          permissions: user.permissions,
          email: user.email.value
        }
        return { token, userDto};
      }
      loginHistory.success = false
      throw new Error(`User ${input.email} not authenticated`)
    } catch (error) {
      loginHistory.success = false
      throw error;
    }finally{
      await this.loginHistory.create(loginHistory)
    }
  }
}

type Input = {
  email:string
  password: string
  device: string
  ip: string
  location: string
}