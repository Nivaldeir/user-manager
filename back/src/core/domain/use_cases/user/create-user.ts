import { User } from "../../entities/user"
import { IUserRepository } from "../../../application/repository/user-repository"
import { Permission } from "../../entities/permission"
import { UserOutputDto } from "./dto"

const permission = [
  {
    id:"19cba769-dd7c-4d55-b5e4-ce1b8684ae04",
    name:"CREATE_USER",
  },
  {
    id:"98025640-9302-451a-8c5c-40623b9d3578",
    name:"UPDATE_USER",
  },
  {
    id:"81fd2a87-90ae-4bbd-bb14-da3ca8cc378f",
    name:"DELETE_USER",
  },
  {
    id:"a1005c0b-13e0-4817-8e77-7b0e569d2c9d",
    name:"FIND_USER",
  },
  {
    id:"ccb4f040-27a8-438c-a870-153b8f01758d",
    name:"FIND_MANY_USER",
  },
]

export class CreateUser {
  constructor(private readonly userRepository: IUserRepository){}
  async execute(input: Input):Promise<UserOutputDto>{
    const user = User.create({...input,
      permissions: permission.map(permission=> new Permission(permission))
    })
    const output = await this.userRepository.create(user)
    return {
      active: output.active,
      email: output.email.value,
      id: output.id,
      permissions: output.permissions.map(e=>e.name),
      username: output.username
    }
  }
}

type Input = {
  email: string
  password: string
  username: string
}