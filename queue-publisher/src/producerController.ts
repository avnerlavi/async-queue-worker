import { Request, Response } from "express";

import { Producer } from "./producers/producer";
import { RabbitMQProducer } from "./producers/rabbitMQProducer";

export class ProducerController {
    private readonly producer: Producer;

    constructor() {
        this.producer = new RabbitMQProducer();
    }

    public async produce(req: Request, res: Response): Promise<void> {
        try {
            const message: string = req.query.message as string;
            if (!message) throw new Error('message cannot be empty!');
            const queue: string = req.params.queueName;
            if (!queue) throw new Error('queue must be declared!');
            this.producer.produce(message, queue).then(() => {
                res.send({ message: 'message sent!' });
            }).catch((err: any) => {
                res.status(500).send(err.message);
            });
        } catch (err: any) {
            res.status(500).send(err.message);
        }
    };
}