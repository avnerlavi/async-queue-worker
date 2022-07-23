import { RabbitMQPublisher } from './rabbitMQPublisher';
import { Publisher } from "./publisher";

export class PublisherFactory {
    private static publisherStrategies: Record<string, () => Promise<Publisher>> = {
        'rabbitmq': async function () {
            return RabbitMQPublisher.create();
        }
    }

    public static async createPublisher(queueType: string): Promise<Publisher> {
        if (!(queueType in this.publisherStrategies)) {
            throw new Error(`publisher cannot be created for given queue type of ${queueType}!`);
        }

        return this.publisherStrategies[queueType]();
    }
}
