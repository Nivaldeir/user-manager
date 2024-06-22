import { UsecaseFactory } from '../application/factory/UserFactory'
import Injectable from '../infra/di/Injectable'
import IHttpServer from '../infra/http/iHttpServer'

export default abstract class HttpController {
    httpServer: IHttpServer
    @Injectable('factory_usecases')
    factory: UsecaseFactory
    constructor(httpServer: IHttpServer) {
        this.httpServer = httpServer
        this.handle()
    }
    abstract handle(): void
}
