import { ILoginAuthHistoryRepository } from "../../../application/repository/login-auth-history";
import { IUserRepository } from "../../../application/repository/user-repository";
import { Token } from "../token";

export class AuthUser {
  constructor(private readonly userRepository:IUserRepository, private readonly loginHistory: ILoginAuthHistoryRepository){}
  async execute(input: Input){
    try {
      const user = await this.userRepository.findByEmail(input.email)
      if(user.password.validate(input.password)){
        const token = Token.generate({
          id: user.id,
          email: user.email.value,
          active:user.active
        })
        return {token};
      }
      throw new Error(`User ${input.email} not authenticated`)
    } catch (error) {
      throw error;
    }
  }
}

type Input = {
  email:string
  password: string
}