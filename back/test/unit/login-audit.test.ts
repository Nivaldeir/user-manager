import { randomUUID } from 'crypto'
import { LoginHistoryAuthentication } from '../../src/core/domain/entities/login-authentication'
describe('Login Audit', () => {
    test('should', () => {
        const input = {
            userId: randomUUID().toString(),
            ip: randomUUID().toString(),
            device: 'Notebook',
            location: 'Sao Paulo',
            success: true,
        }
        const login = LoginHistoryAuthentication.create(input)
        expect(login.id).toBeDefined()
    })
})
