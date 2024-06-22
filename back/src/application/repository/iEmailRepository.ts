export interface IEmailRepository {
    send(input: InputSend): Promise<void>
}

type InputSend = {
    email: string
    object: object
    layout: string
    subject: string
}
