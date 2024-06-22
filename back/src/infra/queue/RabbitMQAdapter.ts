import Logger from '../logger'
import Queue from './IQueue'
import amqp from 'amqplib'
export class RabbitMQAdapter implements Queue {
    app: any
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
