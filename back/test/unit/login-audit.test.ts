import { randomUUID } from 'crypto'
import { LoginAuthentication } from '../../src/core/domain/login-authentication'
describe('Login Audit', () => {
    test('should', () => {
        const input = {
            userId: randomUUID().toString(),
            ip: randomUUID().toString(),
            device: 'Notebook',
            location: 'Sao Paulo',
            success: true,
        }
        const login = LoginAuthentication.create(input)
        expect(login.id).toBeDefined()
    })
})
