import { IUserRepository } from "../../../application/repository/user-repository";

export class FindUser {
  constructor(private readonly userRepository: IUserRepository){}
  async execute(input:Input){
    try {
      const output =  await this.userRepository.findById(input.id)
      return output
    } catch (error) {
      throw error
    }
  }
}
type Input = {
  id: string
}