import { UserAuthentication } from "@prisma/client";
import { IUserAuthenticationRepository } from "../repository/iUserAuthentication";
import { Email } from "./Email";
import Password from "./Password.service";
import Observable from "../observer/Observable";

export default class UserService extends Observable {
  constructor(
    private readonly repository: IUserAuthenticationRepository,
    private readonly passwordService: Password
  ) {
    super();
  }
  async deleteByPermission({
    userId,
    permission,
  }: {
    userId: string;
    permission: string;
  }): Promise<any> {
    await this.repository.deleteByPermission({ userId, permission });
    this.notify("update-permission", { userId });
    console.log("Deleting", permission);
  }
  async addingByPermission({
    userId,
    permission,
  }: {
    userId: string;
    permission: string;
  }): Promise<any> {
    await this.repository.addingByPermission({ userId, permission });
  }
  async gettingPermissions(userId: string) {
    var user = await this.repository.findByUnique({
      where: {
        id: userId,
      },
      include: {
        permission: true,
        role: {
          include: {
            permission: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    const permissions = [
      ...user.role.permission.map((e) => e.name),
      ...user.permission.map((e) => e.name),
    ];
    return {
      user: {
        email: user.email,
        enabled: user.enabled,
        id: user.id,
        password: user.password,
        role: user.role.name,
      },
      permissions,
    };
  }
  async save(input: {
    username?: string;
    email: string;
    password: string;
    id?: string;
  }): Promise<any> {
    const isValidEmail = new Email(input.email);
    const passwordHash = this.passwordService.hashPassword(input.password);
    return await this.repository.save({
      email: isValidEmail.value,
      password: passwordHash.passwordHash,
      salt: passwordHash.salt,
      roleId: undefined,
      enabled: true,
      username: input.username,
      id: input.id,
    });
  }
  async update(
    input: Partial<Omit<UserAuthentication, "id">> & { id: string }
  ): Promise<any> {
    try {
      const user = await this.findById(input.id);
      if (!user) throw new Error("Usuario não encontrado");
      for (const field in input) {
        if (field == "password" && input.password) {
          const passwordHash = this.passwordService.hashPassword(
            input.password
          );
          user.password = passwordHash.passwordHash;
          user.salt = passwordHash.salt;
        }
        if (!["password", "salt"].includes(field)) {
          user[field] = input[field];
        }
      }
      await this.repository.update(user);
    } catch (error) {
      throw new Error(error);
    }
  }
  async updateForRoleUser({
    userId,
    role,
  }: {
    userId: string;
    role: string;
  }): Promise<any> {
    const user = await this.findById(userId);
    if (!user) throw new Error("Usuario não encontrado");
    await this.repository.updateForRoleUser({
      role,
      userId,
    });
    this.notify("update-permission", { userId });
  }
  async findById(id: string): Promise<UserAuthentication> {
    const output = await this.repository.findByUnique({
      where: {
        id,
      },
    });
    return output;
  }
  async find(input?: any): Promise<UserAuthentication[]> {
    // let cached = await this.cache.Get("users")
    // if (cached) {
    //   return JSON.parse(cached)
    // }
    const output = await this.repository.find(input);
    const users = output.map((user) => ({
      ...user,
      password: undefined,
      salt: undefined,
    }));
    // this.cache.Set("users", JSON.stringify(users))
    return users;
  }
  async delete(id: string): Promise<boolean> {
    try {
      await this.repository.delete(id);
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }
}
