
export interface IEmailRepository {
    send(input: {
        email: string
        object: object
        layout: string
        subject: string
    }): Promise<void>
}
