import { randomUUID } from 'crypto'
import { UserAuthentication } from '../../src/core/domain/user-authentication'
import { Permission } from '../../src/core/domain/permission'

describe('user', () => {
    test('should create a instance of user', () => {
        const input = {
            username: 'username',
            email: 'email@teste.com.br',
            password: 'password',
            role: randomUUID(),
        }
        const userAuthentication = UserAuthentication.create({
            username: input.username,
            email: input.email,
            password: input.password,
            roleId: input.role,
        })
        expect(userAuthentication.id).toBeDefined()
        expect(userAuthentication.email.value).toBe(input.email)
        expect(userAuthentication.password.value).toBeDefined()
        expect(userAuthentication.roleId).toBe(input.role)
    })

    test('should content permission', () => {
        const input = {
            username: 'username',
            email: 'email@teste.com.br',
            password: 'password',
            role: randomUUID(),
        }
        const userAuthentication = UserAuthentication.create({
            username: input.username,
            email: input.email,
            password: input.password,
            roleId: input.role,
        })

        const permission = Permission.create("ADMIN")
        userAuthentication.addPermission(permission)
        expect(userAuthentication.permissions[0]).toBe(permission)
    })
})
