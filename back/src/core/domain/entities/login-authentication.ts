import { randomUUID } from 'crypto'

type ILoginHistoryAuthentication = {
    id: string
    ip: string
    device: string
    location: string
    success?: boolean
    userId: string
}

export class LoginHistoryAuthentication {
    id: string
    ip: string
    device: string
    location: string
    success?: boolean
    userId: string
    constructor(props: ILoginHistoryAuthentication) {
        this.id = props.id
        this.device = props.device
        this.ip = props.ip
        this.device = props.device
        this.location = props.location
        this.userId = props.userId
        this.success = props.success ?? false
    }
    static create(
        props: Omit<ILoginHistoryAuthentication, 'id'| 'success'>
    ): LoginHistoryAuthentication {
        const id = randomUUID()
        return new LoginHistoryAuthentication({
            id,
            device: props.device,
            location: props.location,
            userId: props.userId,
            ip: props.ip,
        })
    }
}
