import { ICache } from "../../infra/cache/ICache";
import Injectable from "../../infra/di/Injectable";
import { IRoleRepository } from "../repository/iRole";

export default class RoleService implements IRoleRepository {
  @Injectable("cache")
  private readonly cache: ICache;
  constructor(private readonly repository: IRoleRepository) {}
  async deleteByPermission({
    roleId,
    permission,
  }: {
    roleId: string;
    permission: string;
  }): Promise<any> {
    await this.repository.deleteByPermission({ roleId, permission });
  }
  async addingByPermission({
    roleId,
    permission,
  }: {
    roleId: string;
    permission: string;
  }): Promise<any> {
    await this.repository.addingByPermission({ roleId, permission });
  }

  async save(input: Omit<{ id: string; name: string }, "id">): Promise<any> {
    return await this.repository.save(input);
  }
  async update(
    input: Partial<Omit<{ id: string; name: string }, "id">> & { id: string }
  ): Promise<any> {
    return await this.repository.update(input);
  }
  async findByUnique(id: string): Promise<{ id: string; name: string }> {
    return await this.repository.findByUnique(id);
  }
  async find(input?: any): Promise<{ id: string; name: string }[]> {
    let cached = await this.cache.Get("roles");
    if (cached) return JSON.parse(cached);
    return await this.repository.find();
  }
  async delete(id: string): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
