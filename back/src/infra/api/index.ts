import AuthController from "./controllers/auth-controller"
import LoginAuditController from "./controllers/login-audit-controller"
import PermissionController from "./controllers/permission-controller"
import UserController from "./controllers/user-controller"
import ExpressAdapter from "./server/ExpressAdapter"

const server = new ExpressAdapter()
new AuthController(server)
new LoginAuditController(server)
new PermissionController(server)
new UserController(server)
server.listen(parseInt(process.env.PORT!) | 8080)
export default server