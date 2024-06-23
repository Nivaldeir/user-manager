import { IUserRepository } from "../../../application/repository/user-repository";
import { Password } from "../../entities/password";

export class UpdateUser {
  constructor(private readonly userRepository: IUserRepository){}
  async execute(input:Input){
    const user = await this.userRepository.findBy(input.id)
    if(!user)throw new Error("User not found")
    user.active = input.active ?? user.active
    user.username = input.username ?? user.username
    if(input.password){
      user.password = Password.create(input.password)
    }
    await this.userRepository.update(user)
  }
}
type Input = {
  id:string,
  active?:boolean,
  username?:string,
  password?:string
}