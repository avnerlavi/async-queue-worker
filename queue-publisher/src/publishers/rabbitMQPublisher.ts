import rascal from 'rascal';
import { delay } from '../utils/delay';

import { Publisher } from './publisher';

export class RabbitMQPublisher implements Publisher {
    private availableQueues: string[];
    private readonly broker: rascal.BrokerAsPromised;

    constructor(broker: rascal.BrokerAsPromised) {
        this.broker = broker;
        this.availableQueues = Object.keys(this.broker.config.vhosts!['/'].queues as rascal.QueueConfig[]); // only the '/' vhost configuration exists, which includes all queues
    }

    public static async create(): Promise<RabbitMQPublisher> {
        const config: rascal.BrokerConfig = require('../../config/rascal_config.json');
        config.vhosts!['/'].connection!.url = process.env.RABBITMQ_QUEUE_URL || config.vhosts!['/'].connection?.url; // this replaces the default queue url (e.g., for production use)
        let retryCount: number = 0;
        const RETRY_LIMIT_COUNT = 10;
        const RECONNECT_DELAY_SECONDS = 5;
        while (retryCount < RETRY_LIMIT_COUNT) {
            try {
                const broker: rascal.BrokerAsPromised = await rascal.BrokerAsPromised.create(config);
                broker.on('error', (err, { vhost, connectionUrl }) => {
                    console.error('broker error', err, vhost, connectionUrl);
                });
                
                console.log('broker created.');
                return new RabbitMQPublisher(broker);
            } catch (err: any) {
                retryCount++;
                console.error(err);
                console.log(`retrying broker creation...`);
            }

            await delay(RECONNECT_DELAY_SECONDS);
        }

        throw new Error(`failed ${retryCount} attempts to connect to queue- aborting creation...`);
    }

    public async publish(message: string, queue: string): Promise<void> {
        try {
            if (!this.availableQueues.includes(queue)) throw new Error('requested queue is not allowed!');
            
            const publication: rascal.PublicationSession = await this.broker.publish('/', message, queue);
            publication.on('error', (err, messageId) => {
                console.error('publisher error', err, messageId); 
            });
            
        } catch (err: any) {
            throw err;
        }
    }
}