import { AnyZodObject, ZodError } from 'zod'
import Injectable from '../../../di/Injectable'
import { ICache } from '../../../cache/ICache'
import { CasesFactory } from '../../../../core/application/factory/cases-factory'
import { Token } from '../../../../core/domain/use_cases/token'
export default class Middlware {
    @Injectable('cache')
    private static cache: ICache

    @Injectable('factory_usecases')
    static factory: CasesFactory
    static validateRequest(permissionRequired: string[]) {
        return function (
            target: any,
            propertyKey: string,
            descriptor: PropertyDescriptor
        ) {
            const originalMethod = descriptor.value
            descriptor.value = async function (req: any, res: any, next: any) {

                const token = req.headers.authorization?.split(' ')[1]
                if(!token) {
                   return res.status(403).send({ error: 'Token invalido' })
                }

                let validToken = Token.verify(token) as any
                if(!validToken) res.status(403).send({ error: 'Token invalido' })

                const { permissions } =  await Middlware.factory.findUser.execute({
                    id: validToken.id
                }) 
                console.log(permissions)
                const isPermission = permissionRequired.every(perm => {
                    return permissions.some((permission: any) => permission.name == perm.toUpperCase());
                });
                if (isPermission) {
                    originalMethod.call(this, req, res, next)
                    return;
                }
                res.status(403).send({ error: 'Acesso negado' })
                return;
            }
        }
    }
    static validateSchema(schema: AnyZodObject) {
        return (
            target: any,
            propertyKey: string,
            descriptor: PropertyDescriptor
        ) => {
            const originalMethod = descriptor.value
            descriptor.value = async function (req: any, res: any, next: any) {
                try {
                    await schema.parseAsync({
                        body: req.body,
                        query: req.query,
                        params: req.params,
                    })
                    return originalMethod.call(this, req, res, next)
                } catch (error: ZodError | any) {
                    // const validationErrors = error.map((err: any) => {
                    //     return {
                    //         field: err.path[1],
                    //         message: err.message,
                    //     }
                    // })
                    res.status(401).json({
                        message: 'Erro de validação',
                        errors: error.message,
                    })
                    return
                }
            }
        }
    }
}
