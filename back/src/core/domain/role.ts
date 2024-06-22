import { randomUUID } from 'crypto'
import { Permission } from './permission'

type IRole = {
  id: string
  name: string
  permissions: Permission[]
}

export class Role {
  id: string
  name: string
  permissions: Permission[]

  constructor(props: IRole) {
    this.id = props.id
    this.name = props.name
    this.permissions = props.permissions
  }

  static create(name: string): Role {
    const id = randomUUID()
    return new Role({
      id,
      name,
      permissions: [],
    })
  }

  addPermission(permission: Permission) {
    this.permissions = [...this.permissions, permission]
  }
}
