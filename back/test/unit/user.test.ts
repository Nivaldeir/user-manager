import { randomUUID } from 'crypto'
import { User } from '../../src/core/domain/entities/user'
import { Permission } from '../../src/core/domain/entities/permission'

describe('user', () => {
    const input = {
        username: 'username',
        email: 'email@teste.com.br',
        password: 'password',
        permissions: []
    }

    test('should create a instance of user', () => {

        const userAuthentication = User.create({
            username: input.username,
            email: input.email,
            password: input.password,
            permissions:input.permissions
        })
        expect(userAuthentication.id).toBeDefined()
        expect(userAuthentication.email.value).toBe(input.email)
        expect(userAuthentication.password.value).toBeDefined()
    })

    test('should include permission', () => {
        const userAuthentication = User.create({
            username: input.username,
            email: input.email,
            password: input.password,
            permissions:input.permissions
        })

        const permission = Permission.create("ADMIN")
        userAuthentication.addPermission(permission)
        expect(userAuthentication.permissions[0]).toBe(permission)
    })

    test('should remove permission', () => {
        const userAuthentication = User.create({
            username: input.username,
            email: input.email,
            password: input.password,
            permissions:input.permissions
        })

        const permission = Permission.create("ADMIN")
        userAuthentication.addPermission(permission)
        userAuthentication.removePermission(permission)
        expect(userAuthentication.permissions[0]).not.toBe(permission)
    })

    test('should validate whether the user has permission and return true', () => {
        const userAuthentication = User.create({
            username: input.username,
            email: input.email,
            password: input.password,
            permissions:input.permissions
        })

        const permission = Permission.create("ADMIN")
        userAuthentication.addPermission(permission)
        expect(userAuthentication.checkPermission("ADMIN")).toBeTruthy()
    })
    test('should validate whether the user has permission and return false', () => {
        const userAuthentication = User.create({
            username: input.username,
            email: input.email,
            password: input.password,
            permissions:input.permissions
        })

        const permission = Permission.create("ADMIN")
        userAuthentication.addPermission(permission)
        expect(userAuthentication.checkPermission("MANAGER")).toBeFalsy()
    })
    test('should error not code defined', () => {
        const input = {
            username: 'username',
            email: 'email@teste.com.br',
            password: 'password',
            role: randomUUID(),
        }
        const userAuthentication = User.create({
            username: input.username,
            email: input.email,
            password: input.password,
            permissions: []
        })

        const permission = Permission.create("ADMIN")
        userAuthentication.addPermission(permission)
        expect(() => userAuthentication.checkPermission("")).toThrow("code not defined")
    })
})
