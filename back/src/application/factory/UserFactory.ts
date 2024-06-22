import { PrismaClient } from '@prisma/client'
import UserAuthenticationDatabase from '../../infra/repository/UserAuthentication'
import LoginAuditRepositoryDatabase from '../../infra/repository/LoginAuditRepositoryDatabase'
import { PermissionRepositoryDatabase } from '../../infra/repository/Permission'
import { RoleRepositoryDatabase } from '../../infra/repository/Role'
import AuthService from '../services/Auth.service'
import TokenService from '../services/Token.service'
import PermissionServices from '../services/Permission.service'
import RoleService from '../services/Role.service'
import UserService from '../services/User.service'
import LoginAuditService from '../services/LoginAudit.service'
import PasswordService from '../services/Password.service'
import { NodemailerAdapter } from '../../infra/email/NodemaileAdapter'
import ObservableAuthentication from '../observer/observables/ObservableAuthentication'

export class UsecaseFactory {
    constructor(
        readonly authService: AuthService,
        readonly permissionService: PermissionServices,
        readonly roleService: RoleService,
        readonly userService: UserService,
        readonly loginAuditService: LoginAuditService,
        readonly tokenService: TokenService,
        readonly passwordService: PasswordService
    ) {}

    static create(): UsecaseFactory {
        const db = new PrismaClient()
        const userAuthRepository = new UserAuthenticationDatabase(
            db.userAuthentication
        )
        const loginAuditRepository = new LoginAuditRepositoryDatabase(
            db.loginAudit
        )
        const permissionRepository = new PermissionRepositoryDatabase(
            db.permission
        )
        const roleRepository = new RoleRepositoryDatabase(db.role)

        const tokenService = new TokenService()
        const passwordService = new PasswordService()
        const emailRepository = new NodemailerAdapter()
        const userService = new UserService(userAuthRepository, passwordService)
        const observadorDeLogin = new ObservableAuthentication(
            loginAuditRepository,
            emailRepository,
            userService
        )
        userService.add(observadorDeLogin)
        return new UsecaseFactory(
            new AuthService(
                userAuthRepository,
                tokenService,
                loginAuditRepository,
                passwordService,
                emailRepository
            ).add(observadorDeLogin),
            new PermissionServices(permissionRepository),
            new RoleService(roleRepository),
            userService,
            new LoginAuditService(loginAuditRepository),
            tokenService,
            new PasswordService()
        )
    }
}
