import { RabbitMQConsumer } from './rabbitMQConsumer';
import { EmailConsumerStrategy } from './../strategies/emailConsumerStrategy';
import { ConsumerStrategy } from './../strategies/consumerStrategy';
import { Consumer } from './consumer';

export class ConsumerFactory {
    // public readonly availableFunctions: string[] = process.env.QUEUES?.split(';') || []; //TODO: get rid of this if no nicer solution given 
    public createConsumer(queueType: string, consumerRole: string): Consumer {
        try {
            let consumerStrategy: ConsumerStrategy = this.createStrategy(consumerRole);
            return this.createConsumerByStrategy(queueType, consumerStrategy);
        } catch (err: any) {
            throw err;
        }
    }

    private createStrategy(role: string): ConsumerStrategy {
        switch (role) {
            case 'email':
                return new EmailConsumerStrategy();
            default:
                throw new Error('strategy cannot be created for given role!');
        }
    }

    private createConsumerByStrategy(queueType: string, strategy: ConsumerStrategy): Consumer {
        switch (queueType) {
            case 'rabbitmq':
                return new RabbitMQConsumer(strategy);
            default:
                throw new Error('consumer cannot be created for given role!');
        }
    }
}