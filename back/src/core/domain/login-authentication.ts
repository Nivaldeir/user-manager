import { randomUUID } from 'crypto'

type ILoginAuthentication = {
    id: string
    ip: string
    device: string
    location: string
    success: boolean
    userId: string
}

export class LoginAuthentication {
    id: string
    ip: string
    device: string
    location: string
    success: boolean
    userId: string
    constructor(props: ILoginAuthentication) {
        this.id = props.id
        this.device = props.device
        this.ip = props.ip
        this.device = props.device
        this.location = props.location
        this.userId = props.userId
    }
    static create(
        props: Omit<ILoginAuthentication, 'id'>
    ): LoginAuthentication {
        const id = randomUUID()
        return new LoginAuthentication({
            id,
            device: props.device,
            location: props.location,
            userId: props.userId,
            ip: props.ip,
            success: props.success,
        })
    }
}
