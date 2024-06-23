import { User } from "../../entities/user"
import { IUserRepository } from "../../../application/repository/user-repository"

export class CreateUser {
  constructor(private readonly userRepository: IUserRepository){}
  async execute(input: Input){
    const user = User.create(input)
    const output = await this.userRepository.create(user)
    return output
  }
}

type Input = {
  email: string
  password: string
  username: string
}