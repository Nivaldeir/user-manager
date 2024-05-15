import { LoginAudit } from "@prisma/client";
import { ILoginAuditRepository } from "../repository/iLoginAudit";

export default class LoginAuditService implements ILoginAuditRepository {
  constructor(private readonly repository: ILoginAuditRepository) { }
  async findByUnique(id: string): Promise<LoginAudit> {
    const ouput = await this.repository.findByUnique({ id });
    return ouput;
  }
  async find(input?: any): Promise<LoginAudit[]> {
    const { id } = input
    const ouput = await this.repository.find({ id });
    return ouput;
  }
  async save(input: Omit<LoginAudit, "id">): Promise<any> {
    await this.repository.save(input);
  }
}
