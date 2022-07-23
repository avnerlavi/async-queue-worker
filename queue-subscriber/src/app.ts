import { Role } from './roles/role';
import { RoleFactory } from './roles/roleFactory';
import { Subscriber } from './subscribers/subscriber';
import { SubscriberFactory } from './subscribers/subscriberFactory';

require('dotenv').config({ path: __dirname + '/../.env' });

async function startWorker(): Promise<void> {
    try {
        const queueType = process.env.QUEUE_TYPE;
        if (!queueType) throw new Error('queue type not provided as environment variable');
        const roleType = process.env.ROLE_TYPE;
        if (!roleType) throw new Error('role not provided as environment variable');
        const role: Role = await RoleFactory.createRole(roleType);
        const subscriber: Subscriber = await SubscriberFactory.createSubscriber(queueType, role);
        console.log(`created subscriber for queue of type ${queueType} and of role ${roleType}.`);
        subscriber.subscribe();
    } catch (err: any) {
        console.error(err.message);
        process.exit(1);
    }
}

startWorker();