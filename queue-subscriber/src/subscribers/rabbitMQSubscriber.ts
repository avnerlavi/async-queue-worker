import rascal from 'rascal';
import { Message } from 'amqplib';

import { Subscriber } from "./subscriber";
import { Role } from '../roles/role';
import { delay } from '../utils/delay';

export class RabbitMQSubscriber implements Subscriber {
    public readonly role: Role;
    private readonly broker: rascal.BrokerAsPromised;
    private readonly queueName: string;

    constructor(broker: rascal.BrokerAsPromised, role: Role) {
        this.broker = broker;
        this.queueName = role.name;
        this.role = role;
    }

    public static async create(role: Role): Promise<RabbitMQSubscriber> {
        const config: rascal.BrokerConfig = require('../../config/rascal_config.json');
        let retryCount: number = 0;
        const RETRY_LIMIT_COUNT = 10;
        const RECONNECT_DELAY_SECONDS = 5;
        while (retryCount < RETRY_LIMIT_COUNT) {
            try {
                const broker = await rascal.BrokerAsPromised.create(config);
                broker.on('error', (err, { vhost, connectionUrl }) => {
                    console.error('broker error', err, vhost, connectionUrl);
                });

                console.log('broker created.');
                return new RabbitMQSubscriber(broker, role);
            } catch (err: any) {
                retryCount++;
                console.error(err);
                console.log(`retrying broker creation...`);
            }

            await delay(RECONNECT_DELAY_SECONDS);
        }

        throw new Error(`failed ${retryCount} attempts to connect to queue- aborting creation...`);
    }

    public async subscribe(): Promise<void> {
        try {
            // it is important to note that the queueName is used as the subscription name here- 
            // this needs to be set in the Rascal configuration file
            const subscription: rascal.SubscriberSessionAsPromised = await this.broker.subscribe(this.queueName);
            subscription.on('message', (message: Message, content: any, ackOrNack: rascal.AckOrNack) => {
                if (message) {
                    this.role.execute(content.toString())
                        .then(() => {
                            ackOrNack();
                        }).catch((err: any) => {
                            console.error(err);
                        });
                }
            }).on('error', (err: any) => {
                console.error('subscriber error', err);
            });
        } catch (err: any) {
            console.error(err);
        }
    }
}