import amqp, { ConsumeMessage } from 'amqplib';

import { Consumer } from "./consumer";
import { ConsumerStrategy } from '../strategies/consumerStrategy';

export class RabbitMQConsumer implements Consumer {
    public readonly consumerTag: string;
    public readonly consumerStrategy: ConsumerStrategy;
    private readonly queueName: string;
    private readonly server_url = `amqp://${process.env.RABBITMQ_HOST}:5672`;

    constructor(strategy: ConsumerStrategy) {
        this.queueName = strategy.role;
        this.consumerStrategy = strategy;
        this.consumerTag = `${this.queueName}-consumer`;
    }

    public async consume(): Promise<void> {
        try {
            const connection = await amqp.connect(this.server_url);
            const channel = await connection.createChannel();
            await channel.assertQueue(this.queueName, { durable: true });
            await channel.consume(this.queueName, (message: ConsumeMessage | null) => {
                if (message) {
                    this.consumerStrategy.execute(message.content.toString())
                        .then(() => {
                            channel.ack(message);
                        }).catch((err: any) => {
                            console.log(err.message);
                        });
                }
            }, { consumerTag: this.consumerTag });
        } catch (err: any) {
            console.log(err.message);
            throw err;
        }
    }
}