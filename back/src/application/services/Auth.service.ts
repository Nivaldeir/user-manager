import { ILoginAuditRepository } from "../repository/iLoginAudit";
import IAuthRepository from "../repository/iAuthRepository";
import { IUserAuthenticationRepository } from "../repository/iUserAuthentication";
import TokenService from "./Token.service";
import PasswordService from "./Password.service";
import { IEmailRepository } from "../repository/iEmailRepository";
import Observable from "../observer/Observable";
import { HttpError } from "../../infra/errors/HttpError";
import Injectable from "../../infra/di/Injectable";
import { ICache } from "../../infra/cache/ICache";

export default class AuthService extends Observable implements IAuthRepository {
  @Injectable("cache")
  cache: ICache
  constructor(
    private readonly userRepository: IUserAuthenticationRepository,
    private readonly tokenRepository: TokenService,
    private readonly loginRepository: ILoginAuditRepository,
    private readonly passwordService: PasswordService,
    private readonly emailRepository: IEmailRepository
  ) {
    super()
  }
  async updatePassword(token: string, newPassword: string): Promise<any> {
    const user = this.tokenRepository.verify(token) as { id: string }
    if (!user) throw new Error("Token invalido")
    if (!newPassword) throw new Error("Password invalido")
    const hashPassword = this.passwordService.hashPassword(newPassword)
    await this.userRepository.update({
      id: user.id!,
      password: hashPassword.passwordHash,
      salt: hashPassword.salt
    })
    return
  }
  async recovery(email: string): Promise<any> {
    const user = await this.userRepository.findByUnique({
      where: {
        email: email
      }
    })
    if (!user) throw new Error("Usuario não encontrado!")

    const tokenRecovery = this.tokenRepository.generate({
      body: {
        email,
        id: user.id
      }, expiresIn: "10m"
    })

    await this.emailRepository.send({
      email: email,
      layout: "recovery",
      object: {
        link: `https://localhost:3000/recovery/${tokenRecovery}`
      },
      subject: "Redefinição de senha"
    })
    return tokenRecovery
  }
  async signIn(input: {
    username?: string;
    email?: string;
    password: string;
    details: {
      ip: string, device: string, location: { region: string, city: string, country: string }
    };
  }): Promise<any> {
    try {
      var user = await this.userRepository.findByUnique({
        where: {
          OR: [
            { username: input.username, },
            { email: input.email, }
          ]
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
      if (!user) throw new HttpError("User não encontrado!", 404);
      const authetication = this.passwordService.verifyPassword(
        input.password,
        user.salt,
        user.password
      );
      if (!authetication) {
        await this.loginRepository.save({
          device: input.details.device,
          ip: input.details.ip,
          location: `${input.details.location.region} ${input.details.location.city} / ${input.details.location.country}`,
          success: false,
          userAuthenticationId: user.id,
          createdAt: new Date().toISOString()
        });
        throw new HttpError("Erro senha ou email incorreto!", 401);
      }
      const permissions = [
        ...user.role.permission.map((e) => e.name),
        ...user.permission.map((e) => e.name),
      ];
      const token = this.tokenRepository.generate({
        body: {
          id: user.id,
          username: user.username,
          role: user.role.name,
          email: user.email,
          enable: user.enabled,
        },
        expiresIn: "1d",
      });
      this.notify("first-machine", { user, details: input.details });
      this.cache.delete(`${user.id}_permission`)
      delete user.loginAudit
      delete user.password
      delete user.role.permission
      delete user.permission
      delete user.salt
      return { token, user, permissions }
    } catch (error) {
      if (error instanceof HttpError) {
        throw new HttpError(error.message, error.status);
      }

    }
  }
}
