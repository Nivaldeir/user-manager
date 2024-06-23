import { randomUUID } from 'crypto'
import { Email } from './email'
import { Password } from './password'
import { Permission } from './permission'
import { PermissionHandler } from '../../application/repository/permission-handler'

type IUser = {
    id: string
    username: string
    email: Email
    password: Password
    active: boolean
    permissions: Permission[]
}
type IUserCreate = {
    username: string
    email: string
    password: string
}

export class User extends PermissionHandler {
    id: string
    username: string
    active: boolean
    email: Email
    password: Password
    permissions: Permission[] = []
    constructor(props: IUser) {
        super()
        this.id = props.id
        this.username = props.username
        this.email = props.email
        this.password = props.password
        this.active = props.active
    }
    static create(
        props: Omit<IUserCreate, 'id'>
    ): User {
        const id = randomUUID()
        return new User({
            id: id,
            email: new Email(props.email),
            password: Password.create(props.password),
            username: props.username,
            active: true,
            permissions: [],
        })
    }
    addPermission(permission: Permission): void {
        this.permissions = [...this.permissions, permission];
    }
    removePermission(permission: Permission): void {
        this.permissions = this.permissions.filter(p => p.id !== permission.id);
    }
    checkPermission(authorizationCode: string | string[]): boolean {
        if(!authorizationCode){
            throw new Error("code not defined")
        }
        const codes = Array.isArray(authorizationCode) ? authorizationCode : [authorizationCode];
        return codes.every(code => this.permissions.some(p => p.name === code));
    }
}
