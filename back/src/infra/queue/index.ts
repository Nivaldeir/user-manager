import { UsecaseFactory } from '../../application/factory/UserFactory'
import Injectable from '../di/Injectable'
import Queue from './IQueue'

export default class {
    @Injectable('factory_usecases')
    factory: UsecaseFactory
    constructor(readonly queue: Queue) {
        queue.consume('create-user', async (input: any) => {
            const output = await this.factory.userService.save({
                email: input.email,
                password: input.password,
                ...input,
            })
        })
    }
}
