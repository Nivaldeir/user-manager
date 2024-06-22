console.clear()
import { UsecaseFactory } from './application/factory/UserFactory'
import AuthController from './controllers/AuthController'
import LoginAuditController from './controllers/LoginAuditController'
import PermissionController from './controllers/PermissionController'
import RoleController from './controllers/RoleController'
import UserController from './controllers/UserController'
import { RedisAdapter } from './infra/cache/RedisAdapter'
import Registry from './infra/di/Registry'
import ExpressAdapter from './infra/http/ExpressAdapter'
import Queue from './infra/queue'
import { RabbitMQAdapter } from './infra/queue/RabbitMQAdapter'

const serverHttp = new ExpressAdapter()
const registry = Registry.getInstance()
async function main() {
    const rabbitMQ = new RabbitMQAdapter()
    await rabbitMQ.connect()
    registry.provide('cache', new RedisAdapter())
    registry.provide('queue', new Queue(rabbitMQ))
    registry.provide('factory_usecases', UsecaseFactory.create())
    new UserController(serverHttp)
    new LoginAuditController(serverHttp)
    new PermissionController(serverHttp)
    new RoleController(serverHttp)
    new AuthController(serverHttp)
    serverHttp.listen(8081)
}
main()
