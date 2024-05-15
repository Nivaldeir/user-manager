export default interface Queue {
    connect(): Promise<void>
    consume(queueName: string, callback: Function): Promise<void>
}