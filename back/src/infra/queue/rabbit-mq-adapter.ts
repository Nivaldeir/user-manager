import Logger from '../logger'
import amqp from 'amqplib'
import IQueue from './IQueue'
export class RabbitMQAdapter implements IQueue {
    app: amqp.Connection
    async connect(): Promise<void> {
        this.app = await amqp.connect('amqp://localhost')
    }
    async consume(queueName: string, callback: Function): Promise<void> {
        const channel = await this.app.createChannel()
        await channel.assertQueue(queueName, { durable: true })
        channel.consume(queueName, async (msg: any) => {
            const input = JSON.parse(msg.content.toString())
            try {
                await callback(input)
                channel.ack(msg)
            } catch (err: any) {
                Logger.instance.error(err.message)
            }
        })
    }
}
