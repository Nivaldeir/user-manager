import { AnyZodObject, ZodError } from "zod";
import TokenService from "../../application/services/Token.service";
import { ICache } from "../../infra/cache/ICache";
import Injectable from "../../infra/di/Injectable";
import { UsecaseFactory } from "../../application/factory/UserFactory";

export default class Middlware {
  @Injectable("cache")
  private static cache: ICache;

  @Injectable("factory_usecases")
  static factory: UsecaseFactory;
  static validateRequest(permissionRequired: string[]) {
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      const originalMethod = descriptor.value;
      descriptor.value = async function (req: any, res: any, next: any) {
        const token = req.headers.authorization.split(" ")[1];
        const user = Middlware.factory.tokenService
          .verify(token) as any
        let permissions = (await Middlware.factory.userService.gettingPermissions(user.id)).permissions

        if (!user || !permissionRequired.every(perm => permissions?.includes(perm))) {
          return res.status(403).send({ error: "Acesso negado" });
        }
        return originalMethod.call(this, req, res, next);
      };
    };
  }
  static validateSchema(schema: AnyZodObject) {
    return (_: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      const originalMethod = descriptor.value;
      descriptor.value = async function (req: any, res: any, next: any) {
        try {
          await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
          });
          return originalMethod.call(this, req, res, next);
        } catch (error: ZodError | any) {
          const validationErrors = error.errors.map((err) => {
            return {
              field: err.path[1],
              message: err.message,
            };
          });
          res
            .status(401)
            .json({ message: "Erro de validação", errors: validationErrors });
          return;
        }
      };
    };
  }

  // private static async validateCachePermission(userId): Promise<string[]> {
  //   let cached = await this.cache.Get(`${userId}_permission`);
  //   if (cached) {
  //     return cached.split(",");
  //   }
  //   return [];
  // }
}
