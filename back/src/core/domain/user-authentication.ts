import { randomUUID } from 'crypto'
import { Email } from './email'
import { Password } from './password'
import { Permission } from './permission'

type IUserAuthentication = {
    id: string
    username: string
    email: Email
    password: Password
    active: boolean
    roleId: string
    permissions: Permission[]
}
type IUserAuthenticationCreate = {
    username: string
    email: string
    password: string
    roleId: string
}

export class UserAuthentication {
    id: string
    username: string
    email: Email
    password: Password
    roleId: string
    permissions: Permission[] = []
    constructor(props: IUserAuthentication) {
        this.id = props.id
        this.username = props.username
        this.email = props.email
        this.password = props.password
        this.roleId = props.roleId
    }
    static create(
        props: Omit<IUserAuthenticationCreate, 'id'>
    ): UserAuthentication {
        const id = randomUUID()
        return new UserAuthentication({
            id: id,
            email: new Email(props.email),
            password: Password.create(props.password),
            username: props.username,
            active: true,
            roleId: props.roleId,
            permissions: [],
        })
    }
    addPermission(permission: Permission) {
        this.permissions = [...this.permissions, permission]
    }
}
