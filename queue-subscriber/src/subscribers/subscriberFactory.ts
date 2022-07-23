import { Role } from '../roles/role';
import { Subscriber } from './subscriber';
import { RabbitMQSubscriber } from './rabbitMQSubscriber';

export class SubscriberFactory {
    private static subscriberStrategies: Record<string, (role: Role) => Promise<Subscriber>> = {
        'rabbitmq': async function (role: Role) {
            return RabbitMQSubscriber.create(role);
        }
    }

    public static async createSubscriber(queueType: string, role: Role): Promise<Subscriber> {
        if (!(queueType in this.subscriberStrategies)) {
            throw new Error(`subscriber cannot be created for given queue type of ${queueType}!`);
        }

        return this.subscriberStrategies[queueType](role);
    }
}