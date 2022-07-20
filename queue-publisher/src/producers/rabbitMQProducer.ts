import amqp from 'amqplib';

import { Producer } from './producer';

export class RabbitMQProducer implements Producer {
    private readonly server_url = `amqp://${process.env.RABBITMQ_HOST}:5672`;
    private queueNames: string[] = process.env.QUEUES?.split(';') || [];

    public async produce(message: string, queue: string): Promise<void> {
        try {
            const connection = await amqp.connect(this.server_url);
            const channel = await connection.createChannel();
            if (!this.queueNames.includes(queue)) throw new Error('queue name not in allowed queues!');
            await channel.assertQueue(queue, {durable: true});
            channel.sendToQueue(queue, Buffer.from(message));
            
        } catch (err: any) {
            throw err;
        }
    }
}