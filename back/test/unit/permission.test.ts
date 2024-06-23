import { Permission } from '../../src/core/domain/entities/permission'

describe('permision', () => {
    test('should create instance of permision', () => {
        const permission = Permission.create('CREATE_USER')
        expect(permission).toBeInstanceOf(Permission)
    })
})
