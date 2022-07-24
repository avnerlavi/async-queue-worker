import { Request, Response } from "express";

import { Publisher } from "./publishers/publisher";

type MessageParameters = {
    message: string;
    queue: string;
}

export class PublisherController {
    private readonly publisher: Publisher;

    constructor(publisher: Publisher) {
        this.publisher = publisher;
    }

    public async publish(req: Request, res: Response): Promise<void> {
        try {
            if (!this.publisher) throw new Error('connection to queue not yet established');
            const { message, queue }: MessageParameters = PublisherController.extractMessageParameters(req);
            this.publisher.publish(message, queue).then(() => {
                res.send('message sent!');
            }).catch((err: any) => {
                console.error(err);
                res.status(500);
                res.send(err.message);
            });
        } catch (err: any) {
            console.error(err);
            res.status(500);
            res.send(err.message);
        }
    };

    private static extractMessageParameters(req: Request): MessageParameters {
        const message: string = req.query.message as string;
        if (!message) throw new Error('message cannot be empty!');
        const queue: string = req.params.queueName;
        if (!queue) throw new Error('queue must be declared!');
        return { message, queue };
    }
}