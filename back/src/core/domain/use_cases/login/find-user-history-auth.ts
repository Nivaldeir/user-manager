import { ILoginAuthHistoryRepository } from "../../../application/repository/login-auth-history";

export class FindUserHistoryAuth {
  constructor(private readonly loginRepository: ILoginAuthHistoryRepository){}
  async execute(input:Input){
    console.log(input)
    return await this.loginRepository.findBy({
      id: input.userId
    })
  }
}

type Input = {
  userId: string;
}