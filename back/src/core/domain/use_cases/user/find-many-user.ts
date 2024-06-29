import { IUserRepository } from "../../../application/repository/user-repository";
import { UserOutputDto } from "./dto";

export class FindManyUser {
  constructor(private readonly userRepository: IUserRepository){}
  async execute():Promise<UserOutputDto[]>{
    const users = await this.userRepository.findMany();
    return users.map(user => ({
        active: user.active,
        email: user.email.value,
        id: user.id,
        permissions: user.permissions.map(permission =>permission.name),
        username: user.username
    }))
  }
}