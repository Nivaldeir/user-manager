import { IUserRepository } from "../../../application/repository/user-repository";

export class FindUser {
  constructor(private readonly userRepository: IUserRepository){}
  async execute(input:Input){
    try {
      return await this.userRepository.findBy(input.id)
    } catch (error) {
      throw error
    }
  }
}
type Input = {
  id: string
}