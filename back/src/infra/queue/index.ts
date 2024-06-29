import { CasesFactory } from '../../core/application/factory/cases-factory'
import Injectable from '../di/Injectable'
import Queue from './Iqueue'

export default class {
    @Injectable('factory_usecases')
    factory: CasesFactory
    constructor(readonly queue: Queue) {
        queue.consume('create-user', async (input: any) => {
            await this.factory.createUser.execute({
                email: input.email,
                password: input.password,
                ...input,
            })
        })
    }
}
