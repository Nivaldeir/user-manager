import { Permission } from '../../src/core/domain/permission'
import { Role } from '../../src/core/domain/role'

describe('role', () => {
  test('should create instance of role', () => {
    const role = Role.create('ADMIN')
    expect(role).toBeInstanceOf(Role)
  })
  test('should adding permission for role', () => {
    const role = Role.create('ADMIN')
    const permission = Permission.create('CREATE_USER')
    role.addPermission(permission)
    expect(role.permissions[0]).toBe(permission)
  })
})
